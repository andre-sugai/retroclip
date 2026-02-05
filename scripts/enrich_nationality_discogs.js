import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');
const CACHE_FILE = path.join(__dirname, 'artist_nationality_discogs_cache.json');
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN;

const REQUEST_DELAY_MS = 1500; // 1.5s to be safe (Limit is 60 RPM)
const BATCH_LIMIT = 100; // Save cache after this many requests

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent Cache
let artistCache = {};
let apiCallsCount = 0;

// ISO 3166-1 alpha-2 map for common Discogs country names
// Discogs returns full country names like "UK", "US", "France", "Germany", etc.
const COUNTRY_MAP = {
    "US": "US", "USA": "US", "United States": "US",
    "UK": "GB", "United Kingdom": "GB", "Great Britain": "GB",
    "France": "FR",
    "Germany": "DE", "Deutschland": "DE", "West Germany": "DE",
    "Italy": "IT",
    "Brazil": "BR", "Brasil": "BR",
    "Canada": "CA",
    "Japan": "JP",
    "Australia": "AU",
    "Sweden": "SE",
    "Netherlands": "NL", "Holland": "NL",
    "Spain": "ES",
    "Norway": "NO",
    "Jamaica": "JM",
    "Ireland": "IE",
    "Denmark": "DK",
    "Finland": "FI",
    "Belgium": "BE",
    "New Zealand": "NZ",
    "Switzerland": "CH", "Swiss": "CH",
    "Austria": "AT",
    "Russia": "RU", "USSR": "RU",
    "Poland": "PL",
    "Argentina": "AR",
    "Mexico": "MX",
    "Colombia": "CO",
    "Chile": "CL",
    "Portugal": "PT",
    "Greece": "GR",
    "South Korea": "KR", "Korea": "KR",
    "Europe": "INTL", // Ambiguous
    "World": "INTL"
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

async function fetchDiscogs(url) {
    if (!DISCOGS_TOKEN) {
        throw new Error("DISCOGS_TOKEN is not set.");
    }
    
    // apiCallsCount check logic in main loop
    
    // Add Authorization header
    const headers = {
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
        'User-Agent': 'RetroClipEnrichment/1.0'
    };

    try {
        const response = await fetch(url, { headers });
        
        // Handle Rate Limits specifically
        if (response.status === 429) {
            console.warn("Rate limited by Discogs. Waiting 60s...");
            await sleep(60000);
            return fetchDiscogs(url); // Retry once
        }

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Discogs API Error ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.error('Fetch Error:', e.message);
        return null;
    }
}

function normalizeCountry(countryName) {
    if (!countryName) return null;
    const clean = countryName.trim();
    return COUNTRY_MAP[clean] || COUNTRY_MAP[clean.split(',').pop().trim()] || "INTL";
}

async function getNationalityFromDiscogs(artistName) {
    if (artistCache[artistName] !== undefined) {
        return artistCache[artistName];
    }
    
    try {
        // 1. Search for Artist
        const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(artistName)}&type=artist&per_page=1`;
        console.log(`Searching: ${artistName}...`);
        
        await sleep(REQUEST_DELAY_MS);
        const searchData = await fetchDiscogs(searchUrl);
        apiCallsCount++;

        if (!searchData || !searchData.results || searchData.results.length === 0) {
            console.log(`  Artist not found.`);
            artistCache[artistName] = "NOT_FOUND";
            return "NOT_FOUND";
        }

        const artistId = searchData.results[0].id;
        
        // 2. Get Artist Releases (sort by year asc)
        // We use the releases endpoint which lists releases by this artist
        const releasesUrl = `https://api.discogs.com/artists/${artistId}/releases?sort=year&sort_order=asc&per_page=5`;
        
        await sleep(REQUEST_DELAY_MS);
        const releasesData = await fetchDiscogs(releasesUrl);
        apiCallsCount++;

        if (!releasesData || !releasesData.releases || releasesData.releases.length === 0) {
            console.log(`  No releases found.`);
            artistCache[artistName] = "NOT_FOUND";
            return "NOT_FOUND";
        }

        // 3. Infer Country from Earliest Releases
        // Releases in this list usually don't have full details (like country).
        // We might need to fetch the specific release detail, usually the "master" or "release".
        // HOWEVER, the search result for the artist MIGHT NOT have country.
        // Let's iterate the first few releases and fetch them.
        
        const candidateCountries = {};
        
        let attempts = 0;
        for (const rel of releasesData.releases) {
            if (attempts >= 3) break; // Check max 3 releases
            if (!rel.resource_url) continue;

            await sleep(REQUEST_DELAY_MS);
            const releaseDetail = await fetchDiscogs(rel.resource_url);
            apiCallsCount++;
            attempts++;

            if (releaseDetail && releaseDetail.country) {
                const code = normalizeCountry(releaseDetail.country);
                if (code && code !== "INTL") {
                    candidateCountries[code] = (candidateCountries[code] || 0) + 1;
                }
            }
        }

        // Pick most frequent
        let bestCountry = null;
        let maxCount = 0;
        for (const [code, count] of Object.entries(candidateCountries)) {
            if (count > maxCount) {
                maxCount = count;
                bestCountry = code;
            }
        }

        if (bestCountry) {
            console.log(`  Inferred: ${bestCountry} (from ${maxCount} releases)`);
            artistCache[artistName] = bestCountry;
            return bestCountry;
        } else {
             console.log(`  Could not infer country.`);
             artistCache[artistName] = "NOT_FOUND";
             return "NOT_FOUND";
        }

    } catch (e) {
        console.error('Error processing artist:', e.message);
        return null;
    }
}


async function processFiles() {
    if (!DISCOGS_TOKEN) {
        console.error("❌ ERROR: DISCOGS_TOKEN is missing.");
        console.error("Please export it: export DISCOGS_TOKEN=your_token");
        process.exit(1);
    }

    await loadCache();
    
    // 1. Collect all INTL artists
    console.log("Scanning files for INTL artists...");
    const files = await fs.readdir(DATA_DIR);
    const uniqueArtists = new Set();
    
    // ... logic to find relevant artists
    // Reuse similar logic from other scripts
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
        // Stop if we did too many requests in this run (optional, user can restart)
        // But let's just run forever with auto-save
        
        const nationality = await getNationalityFromDiscogs(artistName);
        processedCountInRun++;
        
        if (processedCountInRun % 10 === 0) {
            await saveCache();
        }
        
        // Also update files immediately?
        // Let's do a bulk update logic at the END of a small batch or just update logic similar to previous scripts
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
