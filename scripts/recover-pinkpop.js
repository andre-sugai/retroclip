import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');
const pinkpopFile = '/tmp/pinkpop_recovered.json';

console.log('🎸 Recovering and migrating Pinkpop festival videos...\n');

if (!fs.existsSync(pinkpopFile)) {
  console.error('❌ Pinkpop file not found at:', pinkpopFile);
  process.exit(1);
}

const pinkpopData = JSON.parse(fs.readFileSync(pinkpopFile, 'utf8'));
console.log(`📦 Found ${pinkpopData.length} Pinkpop videos\n`);

const videosByYear = {};
let videosWithoutYear = 0;

// Group videos by year
pinkpopData.forEach(video => {
  // Add festival metadata
  video.festival = 'pinkpop';
  video.nationality = video.nationality || 'INTL';
  video.is_show = true;
  video.video_type = 'show';
  
  // Try to extract year from song_title if year is null
  let year = video.year;
  
  if (!year && video.song_title) {
    // Try to find year in title (e.g., "Artist - Song (1990)")
    const yearMatch = video.song_title.match(/\((\d{4})\)|\[(\d{4})\]|(\d{4})/);
    if (yearMatch) {
      year = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
      video.year = year;
    }
  }
  
  if (!year) {
    videosWithoutYear++;
    console.warn(`  ⚠️  Video without year: ${video.song_title || video.id}`);
    return;
  }
  
  if (!videosByYear[year]) {
    videosByYear[year] = [];
  }
  
  videosByYear[year].push(video);
});

console.log(`\n📊 Distribution:`);
console.log(`   - Videos with year: ${pinkpopData.length - videosWithoutYear}`);
console.log(`   - Videos without year: ${videosWithoutYear}`);
console.log(`   - Years covered: ${Object.keys(videosByYear).length}\n`);

// Merge into year files
let totalMerged = 0;

Object.keys(videosByYear).sort().forEach(year => {
  const yearFile = path.join(videosDir, `${year}.json`);
  const videosToAdd = videosByYear[year];
  
  let yearData = [];
  
  // Load existing year file if it exists
  if (fs.existsSync(yearFile)) {
    yearData = JSON.parse(fs.readFileSync(yearFile, 'utf8'));
  }
  
  // Add Pinkpop videos
  yearData.push(...videosToAdd);
  
  // Save updated year file
  fs.writeFileSync(yearFile, JSON.stringify(yearData, null, 2));
  
  totalMerged += videosToAdd.length;
  console.log(`✅ Merged ${videosToAdd.length} videos into ${year}.json`);
});

console.log('\n' + '='.repeat(60));
console.log('✨ Pinkpop Recovery Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Videos merged: ${totalMerged}`);
console.log(`   - Videos skipped (no year): ${videosWithoutYear}`);
console.log('='.repeat(60));

console.log('\n✅ Next steps:');
console.log('   1. Regenerate index: npm run generate-index');
console.log('   2. Update App.tsx to use festival filter instead of loadPinkpopVideos()');
console.log('   3. Test the application\n');
