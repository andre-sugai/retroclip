import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');
const pinkpopFile = path.join(videosDir, 'pinkpop.json');

console.log('🎸 Migrating pinkpop.json videos to year files with tags...\n');

if (!fs.existsSync(pinkpopFile)) {
  console.error('❌ pinkpop.json not found');
  process.exit(1);
}

const pinkpopData = JSON.parse(fs.readFileSync(pinkpopFile, 'utf8'));
console.log(`📦 Found ${pinkpopData.length} videos in pinkpop.json\n`);

// First, collect all existing tagged video IDs to avoid duplicates
const existingPinkpopIds = new Set();
const yearFiles = fs.readdirSync(videosDir)
  .filter(file => /^\d{4}\.json$/.test(file))
  .map(file => path.join(videosDir, file));

yearFiles.forEach(filePath => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (Array.isArray(data)) {
      data.forEach(video => {
        if (video.video_tags && video.video_tags.includes('pinkpop')) {
          existingPinkpopIds.add(video.id);
        }
      });
    }
  } catch (err) {
    // Ignore errors
  }
});

console.log(`📊 Found ${existingPinkpopIds.size} videos already tagged with pinkpop\n`);

let videosAdded = 0;
let videosSkipped = 0;
let videosWithoutYear = 0;

// Group pinkpop.json videos by year, skipping duplicates
const videosByYear = {};

pinkpopData.forEach(video => {
  // Skip if already exists in year files
  if (existingPinkpopIds.has(video.id)) {
    videosSkipped++;
    return;
  }
  
  // Ensure video has pinkpop tag
  if (!video.video_tags) {
    video.video_tags = ['pinkpop'];
  } else if (!video.video_tags.includes('pinkpop')) {
    video.video_tags.push('pinkpop');
  }
  
  // Try to extract year from song_title if year is missing
  let year = video.year;
  
  if (!year && video.song_title) {
    const titleStr = typeof video.song_title === 'string' ? video.song_title : String(video.song_title);
    const yearMatch = titleStr.match(/\((\d{4})\)|\[(\d{4})\]|(\d{4})/);
    if (yearMatch) {
      year = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
      video.year = year;
    }
  }
  
  if (!year) {
    videosWithoutYear++;
    console.warn(`  ⚠️  Skipping video without year: ${video.song_title || video.id}`);
    return;
  }
  
  if (!videosByYear[year]) {
    videosByYear[year] = [];
  }
  
  videosByYear[year].push(video);
});

// Merge into year files
Object.keys(videosByYear).sort().forEach(year => {
  const yearFile = path.join(videosDir, `${year}.json`);
  const videosToAdd = videosByYear[year];
  
  let yearData = [];
  
  if (fs.existsSync(yearFile)) {
    yearData = JSON.parse(fs.readFileSync(yearFile, 'utf8'));
  }
  
  yearData.push(...videosToAdd);
  fs.writeFileSync(yearFile, JSON.stringify(yearData, null, 2));
  
  videosAdded += videosToAdd.length;
  console.log(`✅ Added ${videosToAdd.length} videos to ${year}.json`);
});

console.log('\n' + '='.repeat(60));
console.log('✨ Migration Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Videos in pinkpop.json: ${pinkpopData.length}`);
console.log(`   - Already tagged in year files: ${videosSkipped} (skipped)`);
console.log(`   - Videos added to year files: ${videosAdded}`);
console.log(`   - Videos without year: ${videosWithoutYear} (skipped)`);
console.log('='.repeat(60));

console.log('\n✅ Next steps:');
console.log('   1. Delete pinkpop.json: rm data/videos/pinkpop.json');
console.log('   2. Update imvdbService.ts to use only loadByFestival()');
console.log('   3. Regenerate index: npm run generate-index\n');
