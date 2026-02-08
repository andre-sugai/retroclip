import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Artists to update
const artistsToUpdate = ['Bush', 'The Beatles', 'Oasis', 'Sex Pistols', 'The Police'];

// Directory containing video JSON files
const videosDir = path.join(__dirname, '../data/videos');

// Get all JSON files
const files = fs.readdirSync(videosDir).filter(file => file.endsWith('.json'));

let totalUpdated = 0;
const updatesByFile = {};

files.forEach(file => {
  const filePath = path.join(videosDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const videos = JSON.parse(content);
  
  let fileUpdated = false;
  let fileUpdateCount = 0;
  
  videos.forEach(video => {
    if (artistsToUpdate.includes(video.artist_name)) {
      if (video.nationality !== 'EN') {
        console.log(`Updating ${video.artist_name} - "${video.song_title}" (${video.year}) from ${video.nationality} to EN`);
        video.nationality = 'EN';
        fileUpdated = true;
        fileUpdateCount++;
        totalUpdated++;
      }
    }
  });
  
  if (fileUpdated) {
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(videos, null, 2) + '\n', 'utf8');
    updatesByFile[file] = fileUpdateCount;
    console.log(`✓ Updated ${file}: ${fileUpdateCount} videos`);
  }
});

console.log('\n=== Summary ===');
console.log(`Total videos updated: ${totalUpdated}`);
console.log(`Files modified: ${Object.keys(updatesByFile).length}`);
console.log('\nUpdates by file:');
Object.entries(updatesByFile).forEach(([file, count]) => {
  console.log(`  ${file}: ${count} videos`);
});
