import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data/videos');

async function countNationalities() {
    const statsByCountry = {};
    let totalVideos = 0;
    
    try {
        const files = await fs.readdir(DATA_DIR);
        files.sort();

        for (const file of files) {
            if (!file.endsWith('.json')) continue;

            const filePath = path.join(DATA_DIR, file);
            try {
                const fileData = await fs.readFile(filePath, 'utf8');
                const content = JSON.parse(fileData);

                for (const video of content) {
                    totalVideos++;
                    const nationality = video.nationality || 'UNKNOWN';
                    statsByCountry[nationality] = (statsByCountry[nationality] || 0) + 1;
                }
            } catch (e) {
                console.error(`Error reading ${file}:`, e.message);
            }
        }

        // Convert to array and sort by count descending
        const sortedStats = Object.entries(statsByCountry)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        console.log('\n--- Nationality Statistics ---');
        console.log(`Total Videos: ${totalVideos}`);
        console.table(sortedStats);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

countNationalities();
