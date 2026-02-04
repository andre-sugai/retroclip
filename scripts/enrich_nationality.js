import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');
const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2/artist';

const CACHE_FILE = path.join(__dirname, 'artist_nationality_cache.json');
const BATCH_LIMIT = 200; // Max API calls per run

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent Cache
let artistCache = {};
let apiCallsCount = 0;

async function loadCache() {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf8');
        artistCache = JSON.parse(data);
        console.log(`Loaded ${Object.keys(artistCache).length} artists from cache.`);
    } catch (e) {
        console.log('No cache file found, starting fresh.');
        artistCache = {};
    }
}

async function saveCache() {
    try {
        await fs.writeFile(CACHE_FILE, JSON.stringify(artistCache, null, 2));
        console.log(`Saved ${Object.keys(artistCache).length} artists to cache.`);
    } catch (e) {
        console.error('Error saving cache:', e.message);
    }
}

async function getNationality(artistName) {
    if (artistCache[artistName]) {
        return artistCache[artistName];
    }
    
    // No explicit return null here anymore, we handle flow in the main loop

    try {
        apiCallsCount++;
        const query = encodeURIComponent(`artist:${artistName}`);
        const url = `${MUSICBRAINZ_API}?query=${query}&fmt=json`;

        console.log(`[${apiCallsCount}/${BATCH_LIMIT}] Fetching: ${artistName}`);
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RetroClipEnrichment/1.0 ( your@email.com )' 
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch for ${artistName}: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Allow cooldown after a real request
        await sleep(1100);

        if (data.artists && data.artists.length > 0) {
            const artist = data.artists[0];
            const country = artist.country || (artist.area ? artist.area.sort_name : null);
            
            if (country) {
                artistCache[artistName] = country;
                return country;
            }
        }
        
        // Cache "NOT_FOUND" to avoid re-fetching
        artistCache[artistName] = "NOT_FOUND";
        
    } catch (error) {
        console.error(`Error fetching for ${artistName}:`, error.message);
        await sleep(2000);
    }

    return null;
}

async function processFiles() {
    await loadCache();
    
    let totalUpdated = 0;
    const statsByCountry = {};
    
    // Check if directory exists
    try {
        await fs.access(DATA_DIR);
    } catch (e) {
        console.error(`Data directory not found: ${DATA_DIR}`);
        return;
    }

    const files = await fs.readdir(DATA_DIR);
    files.sort();

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(DATA_DIR, file);
        
        let content;
        try {
           const fileData = await fs.readFile(filePath, 'utf8');
           content = JSON.parse(fileData);
        } catch (e) {
            console.error(`Error reading ${file}:`, e.message);
            continue;
        }

        let fileChanged = false;

        for (const video of content) {
            // Check for batch limit and pause if needed
            if (apiCallsCount >= BATCH_LIMIT) {
                console.log(`\nBatch limit of ${BATCH_LIMIT} reached.`);
                console.log('Saving cache and pausing for 2 seconds...');
                await saveCache();
                await sleep(2000);
                apiCallsCount = 0;
                console.log('Resuming...\n');
            }

            // Check if we need to update this video
            let needsUpdate = false;
            
            if (!video.artist_name || video.artist_name.trim() === '') {
                continue;
            }

            if (!video.nationality || video.nationality.trim() === '') {
                needsUpdate = true;
            } else if (video.nationality === 'INTL') {
                needsUpdate = true;
            } else if (video.nationality === 'BR') {
                needsUpdate = false;
            }
            
            if (needsUpdate) {
                const nationality = await getNationality(video.artist_name);
                
                if (nationality && nationality !== "NOT_FOUND") {
                    if (video.nationality !== nationality) {
                        video.nationality = nationality;
                        fileChanged = true;
                        totalUpdated++;
                        console.log(`Updated ${video.artist_name} -> ${nationality} in ${file}`);
                    }
                } else if (nationality === "NOT_FOUND") {
                     // Keep as INTL or whatever it was? 
                     // Or maybe we treat NOT_FOUND as INTL?
                     // For now, do nothing if invalid.
                }
            }
            
            if (video.nationality) {
                 statsByCountry[video.nationality] = (statsByCountry[video.nationality] || 0) + 1;
            }
        }

        if (fileChanged) {
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));
            console.log(`Saved changes to ${file}`);
        }
    }

    await saveCache();

    console.log('\n--- Summary ---');
    console.log(`New API Calls: ${apiCallsCount}`);
    console.log(`Total objects updated: ${totalUpdated}`);
    console.log('Processing Complete.');
}

processFiles().catch(async (err) => {
    console.error(err);
    await saveCache();
});
