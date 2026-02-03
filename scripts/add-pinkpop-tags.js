import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');

console.log('🎸 Adding pinkpop tag to "Live at Pinkpop" videos...\n');

let totalFiles = 0;
let totalVideosUpdated = 0;
let filesUpdated = [];

// Get all year files (files that start with digits)
const yearFiles = fs.readdirSync(videosDir)
  .filter(file => /^\d{4}\.json$/.test(file))
  .map(file => path.join(videosDir, file));

console.log(`📁 Processing ${yearFiles.length} year files...\n`);

yearFiles.forEach(filePath => {
  const filename = path.basename(filePath);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;
    let updatedCount = 0;
    
    if (Array.isArray(data)) {
      data.forEach(video => {
        const songTitle = video.song_title || '';
        
        // Ensure songTitle is a string before calling toLowerCase
        const titleStr = typeof songTitle === 'string' ? songTitle : String(songTitle);
        
        // Check if song_title contains "Live at Pinkpop" (case insensitive)
        if (titleStr.toLowerCase().includes('live at pinkpop')) {
          // Initialize video_tags if it doesn't exist
          if (!video.video_tags) {
            video.video_tags = [];
          }
          
          // Add 'pinkpop' tag if not already present
          if (!video.video_tags.includes('pinkpop')) {
            video.video_tags.push('pinkpop');
            updated = true;
            updatedCount++;
            
            console.log(`  ✅ Added pinkpop tag to: ${titleStr.substring(0, 60)}...`);
          }
        }
      });
      
      // Save file if any videos were updated
      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        totalVideosUpdated += updatedCount;
        filesUpdated.push(filename);
        console.log(`✓ Updated ${filename}: ${updatedCount} videos\n`);
      }
    }
    
    totalFiles++;
  } catch (err) {
    console.error(`❌ Error processing ${filename}: ${err.message}`);
  }
});

console.log('='.repeat(60));
console.log('✨ Pinkpop Tag Addition Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Files processed: ${totalFiles}`);
console.log(`   - Files updated: ${filesUpdated.length}`);
console.log(`   - Videos updated: ${totalVideosUpdated}`);

if (filesUpdated.length > 0) {
  console.log(`\n📝 Updated files:`);
  filesUpdated.forEach(file => console.log(`   - ${file}`));
}

console.log('\n✅ Next step:');
console.log('   - Regenerate index: npm run generate-index');
console.log('='.repeat(60) + '\n');
