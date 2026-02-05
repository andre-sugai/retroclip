import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');
const CACHE_FILE = path.join(__dirname, 'artist_nationality_gemini_cache.json');
const API_KEY = process.env.GEMINI_API_KEY;

// Rate limiting: Heavy throttling observed. Increasing delay significantly.
const BATCH_SIZE = 15; 
const REQUEST_DELAY_MS = 15000; // 15s to be safe

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent Cache
let artistCache = {};

async function loadCache() {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf8');
        artistCache = JSON.parse(data);
        console.log(`Loaded ${Object.keys(artistCache).length} artists from cache.`);
    } catch (e) {
        artistCache = {};
    }
}

async function saveCache() {
    try {
        await fs.writeFile(CACHE_FILE, JSON.stringify(artistCache, null, 2));
        console.log(`Saved cache.`);
    } catch (e) {
        console.error('Error saving cache:', e.message);
    }
}

async function fetchGemini(artistsBatch) {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }

    const prompt = `
    Identify the 2-letter ISO 3166-1 alpha-2 country code for the origin of the following music artists.
    If the artist is unknown, completely ambiguous, or an international collaboration with no single country, return "INTL".
    If the artist is from the United Kingdom, use "GB".
    
    Return ONLY a valid JSON object where keys are the artist names and values are the country codes.
    Do not use markdown formatting.
    
    Artists:
    ${JSON.stringify(artistsBatch)}
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
             const errText = await response.text();
             throw new Error(`Gemini API Error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) return null;

        // Clean markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);

    } catch (e) {
        console.error('Gemini Fetch Error:', e.message);
        return null;
    }
}

async function processFiles() {
    if (!API_KEY) {
        console.error("❌ ERROR: GEMINI_API_KEY environment variable is missing.");
        console.error("Please export it: export GEMINI_API_KEY=your_key");
        process.exit(1);
    }

    await loadCache();
    
    // 1. Collect all INTL artists
    console.log("Scanning files for INTL artists...");
    const files = await fs.readdir(DATA_DIR);
    const uniqueArtists = new Set();
    const fileMap = {}; // artist -> [files]

    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(DATA_DIR, file);
        try {
            const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
            for (const video of content) {
                if (!video.artist_name) continue;
                
                // Check if needs update (missing or INTL)
                // AND not already in cache (or cached as INTL/NOT_FOUND, maybe we want to retry? For now assume cache is final)
                // Actually, if cache has "INTL", we might want to skip it to avoid burning tokens on same result.
                
                const needsUpdate = (!video.nationality || video.nationality === 'INTL');
                
                if (needsUpdate) {
                    if (!artistCache[video.artist_name]) { // Only if not cached
                        uniqueArtists.add(video.artist_name);
                    }
                }
            }
        } catch (e) {
            console.error(`Error reading ${file}`);
        }
    }

    const artistsToProcess = Array.from(uniqueArtists).sort();
    console.log(`Found ${artistsToProcess.length} unique artists to process.`);

    // 2. Process in batches
    let processedCount = 0;
    
    for (let i = 0; i < artistsToProcess.length; i += BATCH_SIZE) {
        const batch = artistsToProcess.slice(i, i + BATCH_SIZE);
        console.log(`[${i}/${artistsToProcess.length}] Processing batch of ${batch.length}...`);
        
        const results = await fetchGemini(batch);
        
        if (results) {
            for (const [artist, country] of Object.entries(results)) {
                if (country && country.length === 2) {
                    artistCache[artist] = country;
                    console.log(`  ${artist} -> ${country}`);
                } else {
                     artistCache[artist] = "INTL"; // Default if model returns weird stuff
                }
            }
        } else {
            console.log("  Failed batch, skipping...");
        }
        
        processedCount += batch.length;
        await saveCache(); // Save after every batch
        
        if (i + BATCH_SIZE < artistsToProcess.length) {
            console.log(`Waiting ${REQUEST_DELAY_MS}ms for rate limit...`);
            await sleep(REQUEST_DELAY_MS);
        }
    }

    // 3. Update files
    console.log("Updating files with new data...");
    let totalUpdated = 0;

    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(DATA_DIR, file);
        let content;
        try {
            content = JSON.parse(await fs.readFile(filePath, 'utf8'));
        } catch (e) { continue; }

        let fileChanged = false;

        for (const video of content) {
            if (!video.artist_name) continue;
            
            const cached = artistCache[video.artist_name];
            if (cached && cached !== "INTL" && cached !== "NOT_FOUND") {
                if (video.nationality !== cached) {
                    // Only update if current is INTL or missing
                    if (!video.nationality || video.nationality === 'INTL') {
                        video.nationality = cached;
                        fileChanged = true;
                        totalUpdated++;
                    }
                }
            }
        }

        if (fileChanged) {
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));
            console.log(`Updated ${file}`);
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Total objects updated in files: ${totalUpdated}`);
    console.log(`Done.`);
}

processFiles().catch(console.error);
