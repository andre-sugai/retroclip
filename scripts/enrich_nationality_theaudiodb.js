import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');
const CACHE_FILE = path.join(__dirname, 'artist_nationality_theaudiodb_cache.json');
const API_KEY = "2"; // Public Test API Key

const REQUEST_DELAY_MS = 2500; // 2.5s safe delay (Limit is ~1 request per 2s)
const BATCH_LIMIT = 50; // Save cache after this many requests

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent Cache
let artistCache = {};
let apiCallsCount = 0;

// Mapping for full country names if strCountryCode is missing
const COUNTRY_MAP = {
    "United States": "US", "USA": "US",
    "United Kingdom": "GB", "UK": "GB",
    "France": "FR",
    "Germany": "DE",
    "Italy": "IT",
    "Brazil": "BR",
    "Canada": "CA",
    "Japan": "JP",
    "Australia": "AU",
    "Sweden": "SE",
    "Netherlands": "NL",
    "Spain": "ES",
    "Norway": "NO",
    "Jamaica": "JM",
    "Ireland": "IE",
    "Denmark": "DK",
    "Finland": "FI",
    "Belgium": "BE",
    "New Zealand": "NZ",
    "Switzerland": "CH",
    "Austria": "AT",
    "Russia": "RU",
    "Poland": "PL",
    "Argentina": "AR",
    "Mexico": "MX",
    "Portugal": "PT",
    "South Korea": "KR",
    // Add more as needed based on observation
};

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

async function fetchTheAudioDB(artistName) {
    const url = `https://www.theaudiodb.com/api/v1/json/${API_KEY}/search.php?s=${encodeURIComponent(artistName)}`;
    
    try {
        const response = await fetch(url);
        
        if (response.status === 429) {
            console.warn("Rate limited by TheAudioDB. Waiting 60s...");
            await sleep(60000);
            return fetchTheAudioDB(artistName); // Retry
        }

        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error('Fetch Error:', e.message);
        return null;
    }
}

async function getNationalityFromTheAudioDB(artistName) {
    if (artistCache[artistName] !== undefined) {
        return artistCache[artistName];
    }
    
    try {
        console.log(`Searching: ${artistName}...`);
        await sleep(REQUEST_DELAY_MS);
        const data = await fetchTheAudioDB(artistName);
        apiCallsCount++;

        if (!data || !data.artists || data.artists.length === 0 || !data.artists[0]) {
            console.log(`  Artist not found.`);
            artistCache[artistName] = "NOT_FOUND";
            return "NOT_FOUND";
        }

        const artistData = data.artists[0];
        let country = artistData.strCountryCode;

        // Fallback to name map if code is missing or invalid (iso should be 2 chars)
        if (!country || country.length !== 2) {
             if (artistData.strCountry) {
                 country = COUNTRY_MAP[artistData.strCountry] || "INTL";
             }
        }
        
        // Final sanity check
        if (!country) country = "INTL";

        if (country !== "INTL" && country !== "NOT_FOUND") {
            console.log(`  Found: ${country} (${artistData.strCountry})`);
            artistCache[artistName] = country;
            return country;
        } else {
             console.log(`  Country info missing/ambiguous.`);
             artistCache[artistName] = "NOT_FOUND";
             return "NOT_FOUND";
        }

    } catch (e) {
        console.error('Error processing artist:', e.message);
        return null;
    }
}


async function processFiles() {
    await loadCache();
    
    // 1. Collect all INTL artists
    console.log("Scanning files for INTL artists...");
    const files = await fs.readdir(DATA_DIR);
    const uniqueArtists = new Set();
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const filePath = path.join(DATA_DIR, file);
        try {
            const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
            for (const video of content) {
                if (!video.artist_name) continue;
                const needsUpdate = (!video.nationality || video.nationality === 'INTL');
                if (needsUpdate && !artistCache[video.artist_name]) {
                     uniqueArtists.add(video.artist_name);
                }
            }
        } catch (e) {}
    }

    const artistsToProcess = Array.from(uniqueArtists).sort();
    console.log(`Found ${artistsToProcess.length} unique artists to process.`);

    let processedCountInRun = 0;

    for (const artistName of artistsToProcess) {
        const nationality = await getNationalityFromTheAudioDB(artistName);
        processedCountInRun++;
        
        if (processedCountInRun % 20 === 0) {
            await saveCache();
        }
    }
    await saveCache();

    // 2. Update files pass
    console.log("Updating files...");
    let totalUpdated = 0;
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const filePath = path.join(DATA_DIR, file);
        let content;
        try { content = JSON.parse(await fs.readFile(filePath, 'utf8')); } catch(e) { continue; }
        let changed = false;
        
        for (const video of content) {
             if (!video.artist_name) continue;
             const cached = artistCache[video.artist_name];
             if (cached && cached !== "NOT_FOUND" && cached !== "INTL") {
                  if (video.nationality !== cached && (video.nationality === 'INTL' || !video.nationality)) {
                      video.nationality = cached;
                      changed = true;
                      totalUpdated++;
                  }
             }
        }
        if (changed) {
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));
            console.log(`Updated ${file}`);
        }
    }
    
    console.log(`Done. Updated ${totalUpdated} videos.`);
}

processFiles().catch(console.error);
