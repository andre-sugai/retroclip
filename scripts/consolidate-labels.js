import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');

console.log('🔄 Consolidating record label files into year files...\n');

const labelFiles = ['atlantic.json', 'road_runner.json', 'subpop.json', 'epitaph.json'];
const stats = {
  videosMerged: 0,
  filesUpdated: new Set(),
};

labelFiles.forEach(labelFile => {
  const labelPath = path.join(videosDir, labelFile);
  
  if (!fs.existsSync(labelPath)) {
    console.warn(`⚠️  File not found: ${labelFile}`);
    return;
  }
  
  console.log(`📦 Processing ${labelFile}...`);
  
  const labelData = JSON.parse(fs.readFileSync(labelPath, 'utf8'));
  const videosByYear = {};
  
  // Group videos by year
  labelData.forEach(video => {
    const year = video.year;
    if (!year) {
      console.warn(`  ⚠️  Video without year: ${video.song_title || video.id}`);
      return;
    }
    
    if (!videosByYear[year]) {
      videosByYear[year] = [];
    }
    
    videosByYear[year].push(video);
  });
  
  // Merge into year files
  Object.keys(videosByYear).forEach(year => {
    const yearFile = path.join(videosDir, `${year}.json`);
    const videosToAdd = videosByYear[year];
    
    let yearData = [];
    
    // Load existing year file if it exists
    if (fs.existsSync(yearFile)) {
      yearData = JSON.parse(fs.readFileSync(yearFile, 'utf8'));
    }
    
    // Add label videos
    yearData.push(...videosToAdd);
    
    // Save updated year file
    fs.writeFileSync(yearFile, JSON.stringify(yearData, null, 2));
    
    stats.videosMerged += videosToAdd.length;
    stats.filesUpdated.add(`${year}.json`);
    
    console.log(`  ✅ Merged ${videosToAdd.length} videos into ${year}.json`);
  });
  
  console.log(`  ✓ Total from ${labelFile}: ${labelData.length} videos\n`);
});

console.log('='.repeat(60));
console.log('✨ Consolidation Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Videos merged: ${stats.videosMerged}`);
console.log(`   - Year files updated: ${stats.filesUpdated.size}`);
console.log('='.repeat(60));

console.log('\n🗑️  You can now safely delete:');
labelFiles.forEach(file => {
  console.log(`   - data/videos/${file}`);
});

console.log('\n✅ Next steps:');
console.log('   1. Delete the label files: rm data/videos/{atlantic,road_runner,subpop,epitaph}.json');
console.log('   2. Regenerate index: npm run generate-index');
console.log('   3. Test the application\n');
