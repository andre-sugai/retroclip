import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');
const CACHE_FILE = path.join(__dirname, 'artist_nationality_wiki_cache.json');
const COUNTRY_CACHE_FILE = path.join(__dirname, 'country_iso_cache.json');
const BATCH_LIMIT = 200; // Max API calls per run

// Helper to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent Caches
let artistCache = {};
let countryIsoCache = {};
let apiCallsCount = 0;

async function loadCaches() {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf8');
        artistCache = JSON.parse(data);
        console.log(`Loaded ${Object.keys(artistCache).length} artists from cache.`);
    } catch (e) {
        artistCache = {};
    }
    
    try {
        const data = await fs.readFile(COUNTRY_CACHE_FILE, 'utf8');
        countryIsoCache = JSON.parse(data);
    } catch (e) {
        countryIsoCache = {};
    }
}

async function saveCaches() {
    try {
        await fs.writeFile(CACHE_FILE, JSON.stringify(artistCache, null, 2));
        await fs.writeFile(COUNTRY_CACHE_FILE, JSON.stringify(countryIsoCache, null, 2));
        console.log(`Saved caches.`);
    } catch (e) {
        console.error('Error saving cache:', e.message);
    }
}

async function fetchJson(url) {
    // apiCallsCount >= BATCH_LIMIT handled in main loop
    
    apiCallsCount++;
    console.log(`[${apiCallsCount}/${BATCH_LIMIT}] fetching: ${url}`);
    
    try {
        const response = await fetch(url, {
             headers: { 'User-Agent': 'RetroClipEnrichment/1.0 ( your@email.com )' }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error('Fetch error:', e.message);
        return null;
    }
}

async function getIsoFromQId(qId) {
    if (countryIsoCache[qId]) return countryIsoCache[qId];
    
    // Fetch country entity
    // P297 is ISO 3166-1 alpha-2 code
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qId}&props=claims&format=json`;
    const data = await fetchJson(url);
    await sleep(1100);

    if (data && data.entities && data.entities[qId]) {
        const claims = data.entities[qId].claims;
        if (claims && claims.P297 && claims.P297.length > 0) {
            const iso = claims.P297[0].mainsnak.datavalue.value;
            countryIsoCache[qId] = iso;
            return iso;
        }
    }
    
    // Cache as null to avoid re-fetching weird entities that aren't countries
    countryIsoCache[qId] = null;
    return null;
}

async function getNationalityFromWikidata(artistName) {
    if (artistCache[artistName] !== undefined) {
        return artistCache[artistName];
    }
    
    // apiCallsCount check handled in main loop

    try {
        // 1. Search for artist
        const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(artistName)}&language=en&format=json&type=item&limit=1`;
        const searchData = await fetchJson(searchUrl);
        await sleep(1100);

        if (!searchData || !searchData.search || searchData.search.length === 0) {
            artistCache[artistName] = "NOT_FOUND";
            return "NOT_FOUND";
        }

        const qId = searchData.search[0].id; // e.g., Q12345

        // 2. Get details (Country of origin P495 or Citizenship P27)
        const detailsUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qId}&property=P495&format=json`;
        let claimsData = await fetchJson(detailsUrl);
        await sleep(1100);

        let countryQId = null;
        
        // Try P495 (Country of origin)
        if (claimsData && claimsData.claims && claimsData.claims.P495) {
             countryQId = claimsData.claims.P495[0].mainsnak.datavalue.value.id;
        } else {
             // Try P27 (Citizenship)
             const p27Url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qId}&property=P27&format=json`;
             claimsData = await fetchJson(p27Url);
             await sleep(1100);
             
             if (claimsData && claimsData.claims && claimsData.claims.P27) {
                 countryQId = claimsData.claims.P27[0].mainsnak.datavalue.value.id;
             }
        }

        if (countryQId) {
            const iso = await getIsoFromQId(countryQId);
            if (iso) {
                artistCache[artistName] = iso;
                return iso;
            }
        } else {
            console.log(`No country claims found for ${artistName} (${qId})`);
        }

        artistCache[artistName] = "NOT_FOUND";
        return "NOT_FOUND";

    } catch (e) {
        console.error('Error processing', artistName, e.message);
        await sleep(2000);
    }
    
    return null; // Don't cache error state unless sure
}

async function processFiles() {
    await loadCaches();
    
    let totalUpdated = 0;
    
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
        if (apiCallsCount >= BATCH_LIMIT) break;

        const filePath = path.join(DATA_DIR, file);
        let content;
        try {
           const fileData = await fs.readFile(filePath, 'utf8');
           content = JSON.parse(fileData);
        } catch (e) {
            continue;
        }

        let fileChanged = false;

        for (const video of content) {
            if (apiCallsCount >= BATCH_LIMIT) {
                console.log(`\nBatch limit of ${BATCH_LIMIT} reached.`);
                console.log('Saving cache and pausing for 2 seconds...');
                await saveCaches();
                await sleep(2000);
                apiCallsCount = 0;
                console.log('Resuming...\n');
            }

            // ONLY process INTL or missing
            if (!video.artist_name) continue;
            
            const isIntl = video.nationality === 'INTL';
            const isMissing = !video.nationality;

            if (isIntl || isMissing) {
                const nationality = await getNationalityFromWikidata(video.artist_name);
                
                if (nationality && nationality !== "NOT_FOUND") {
                    if (video.nationality !== nationality) {
                        video.nationality = nationality;
                        fileChanged = true;
                        totalUpdated++;
                        console.log(`Updated ${video.artist_name} -> ${nationality} in ${file}`);
                    }
                }
            }
        }

        if (fileChanged) {
            await fs.writeFile(filePath, JSON.stringify(content, null, 2));
            console.log(`Saved changes to ${file}`);
        }
    }

    await saveCaches();

    console.log('\n--- Summary ---');
    console.log(`New API Calls: ${apiCallsCount}`);
    console.log(`Total objects updated: ${totalUpdated}`);
}

processFiles().catch(async (err) => {
    console.error(err);
    await saveCaches();
});
