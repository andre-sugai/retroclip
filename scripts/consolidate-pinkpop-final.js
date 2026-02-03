import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');
const pinkpopFile = path.join(videosDir, 'pinkpop.json');

console.log('🎸 Consolidating ALL Pinkpop videos into year files...\n');

if (!fs.existsSync(pinkpopFile)) {
  console.error('❌ pinkpop.json not found');
  process.exit(1);
}

const pinkpopData = JSON.parse(fs.readFileSync(pinkpopFile, 'utf8'));
console.log(`📦 Found ${pinkpopData.length} videos in pinkpop.json\n`);

// Get all existing tagged video IDs to avoid duplicates
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
    // Ignore
  }
});

console.log(`📊 Found ${existingPinkpopIds.size} videos already tagged\n`);

// For videos without year, assign them to a special "unknown" year file
// We'll use 1970 as a placeholder for videos without year data
const UNKNOWN_YEAR = 1970;
const unknownYearFile = path.join(videosDir, `${UNKNOWN_YEAR}.json`);

let videosAdded = 0;
let videosSkipped = 0;

// Load existing 1970.json if it exists
let unknownYearData = [];
if (fs.existsSync(unknownYearFile)) {
  unknownYearData = JSON.parse(fs.readFileSync(unknownYearFile, 'utf8'));
}

pinkpopData.forEach(video => {
  // Skip if already exists
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
  
  // Set year to UNKNOWN_YEAR if missing
  if (!video.year) {
    video.year = UNKNOWN_YEAR;
  }
  
  unknownYearData.push(video);
  videosAdded++;
});

// Save the consolidated file
if (videosAdded > 0) {
  fs.writeFileSync(unknownYearFile, JSON.stringify(unknownYearData, null, 2));
  console.log(`✅ Added ${videosAdded} videos to ${UNKNOWN_YEAR}.json`);
}

console.log('\n' + '='.repeat(60));
console.log('✨ Consolidation Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Videos in pinkpop.json: ${pinkpopData.length}`);
console.log(`   - Already tagged: ${videosSkipped}`);
console.log(`   - Added to ${UNKNOWN_YEAR}.json: ${videosAdded}`);
console.log('='.repeat(60));

console.log('\n✅ Next steps:');
console.log('   1. Delete pinkpop.json: rm data/videos/pinkpop.json');
console.log('   2. Regenerate index: npm run generate-index');
console.log('   3. Update loadByFestival to NOT load pinkpop.json\n');
