const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the kexp.json file
const kexpJsonPath = '/Users/andresugai/Desktop/PROJETOS/SCRIPTS/music/kexp.json';

console.log('Loading kexp.json...');
const data = JSON.parse(fs.readFileSync(kexpJsonPath, 'utf8'));
console.log(`Total videos: ${data.length}`);

// Count how many need updating
const needsUpdate = data.filter(item => item.year === null).length;
console.log(`Videos needing year update: ${needsUpdate}`);

let updated = 0;
let errors = 0;
let skipped = 0;

for (let i = 0; i < data.length; i++) {
  const item = data[i];
  
  // Skip if year is already set
  if (item.year !== null) {
    skipped++;
    continue;
  }
  
  const videoId = item.youtube_link.match(/watch\?v=([^&]+)/)?.[1];
  
  if (!videoId) {
    console.error(`Cannot extract video ID from: ${item.youtube_link}`);
    errors++;
    continue;
  }
  
  console.log(`[${i + 1}/${data.length}] Processing: ${item.song_title}`);
  
  try {
    // Use yt-dlp to get the upload date
    const command = `yt-dlp --dump-json --no-warnings "https://www.youtube.com/watch?v=${videoId}" 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('upload_date', ''))"`;
    
    const uploadDate = execSync(command, { encoding: 'utf8' }).trim();
    
    if (uploadDate && uploadDate.length === 8) {
      // Extract year from YYYYMMDD format
      const year = parseInt(uploadDate.substring(0, 4));
      item.year = year;
      updated++;
      console.log(`  ✓ Year set to: ${year}`);
    } else {
      console.error(`  ✗ Invalid upload date: ${uploadDate}`);
      errors++;
    }
    
    // Save progress every 10 videos
    if (updated % 10 === 0) {
      fs.writeFileSync(kexpJsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  → Progress saved (${updated} videos updated)`);
    }
    
    // Add a small delay to avoid rate limiting
    if (i < data.length - 1) {
      execSync('sleep 1');
    }
    
  } catch (error) {
    console.error(`  ✗ Error processing video: ${error.message}`);
    errors++;
  }
}

// Save final results
console.log('\nSaving final results...');
fs.writeFileSync(kexpJsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n=== Summary ===');
console.log(`Total videos: ${data.length}`);
console.log(`Updated: ${updated}`);
console.log(`Skipped (already had year): ${skipped}`);
console.log(`Errors: ${errors}`);
console.log('\nDone!');
