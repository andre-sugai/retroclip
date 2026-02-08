import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing video JSON files
const videosDir = path.join(__dirname, '../data/videos');

// Get all JSON files
const files = fs.readdirSync(videosDir).filter(file => file.endsWith('.json'));

const indochineVideos = [];

files.forEach(file => {
  const filePath = path.join(videosDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const videos = JSON.parse(content);
  
  videos.forEach(video => {
    // Check both 'artist' and 'artist_name' fields
    const artistName = video.artist || video.artist_name;
    if (artistName === 'Indochine') {
      indochineVideos.push({
        song_title: video.song_title,
        year: video.year,
        nationality: video.nationality
      });
    }
  });
});

// Sort by year
indochineVideos.sort((a, b) => a.year - b.year);

// Print as table
console.log('\n=== Indochine Videos ===\n');
console.log('Song Title\t\t\t\tYear\tNationality');
console.log('─'.repeat(80));
indochineVideos.forEach(video => {
  const title = video.song_title.padEnd(40);
  console.log(`${title}\t${video.year}\t${video.nationality}`);
});
console.log('\nTotal videos: ' + indochineVideos.length);
