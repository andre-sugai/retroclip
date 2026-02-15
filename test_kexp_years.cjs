const { execSync } = require('child_process');
const fs = require('fs');

// Path to the kexp.json file
const kexpJsonPath = '/Users/andresugai/Desktop/PROJETOS/SCRIPTS/music/kexp.json';

console.log('Loading kexp.json...');
const data = JSON.parse(fs.readFileSync(kexpJsonPath, 'utf8'));
console.log(`Total videos: ${data.length}`);

// Test with only the first 5 videos that need updating
const testLimit = 5;
let processed = 0;
let updated = 0;
let errors = 0;

console.log(`\n=== Testing with first ${testLimit} videos ===\n`);

for (let i = 0; i < data.length && processed < testLimit; i++) {
  const item = data[i];
  
  // Skip if year is already set
  if (item.year !== null) {
    continue;
  }
  
  const videoId = item.youtube_link.match(/watch\?v=([^&]+)/)?.[1];
  
  if (!videoId) {
    console.error(`Cannot extract video ID from: ${item.youtube_link}`);
    errors++;
    processed++;
    continue;
  }
  
  console.log(`[${processed + 1}/${testLimit}] Processing: ${item.song_title}`);
  console.log(`  Video ID: ${videoId}`);
  
  try {
    // Use yt-dlp to get the upload date
    const command = `yt-dlp --dump-json --no-warnings "https://www.youtube.com/watch?v=${videoId}" 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('upload_date', ''))"`;
    
    const uploadDate = execSync(command, { encoding: 'utf8' }).trim();
    
    if (uploadDate && uploadDate.length === 8) {
      // Extract year from YYYYMMDD format
      const year = parseInt(uploadDate.substring(0, 4));
      console.log(`  ✓ Upload date: ${uploadDate}`);
      console.log(`  ✓ Year extracted: ${year}`);
      updated++;
    } else {
      console.error(`  ✗ Invalid upload date: ${uploadDate}`);
      errors++;
    }
    
    processed++;
    
    // Add a small delay
    if (processed < testLimit) {
      console.log('  → Waiting 1 second...\n');
      execSync('sleep 1');
    }
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    errors++;
    processed++;
  }
}

console.log('\n=== Test Summary ===');
console.log(`Processed: ${processed}`);
console.log(`Successfully extracted years: ${updated}`);
console.log(`Errors: ${errors}`);
console.log('\nNote: This was a test run. The actual kexp.json file was NOT modified.');
