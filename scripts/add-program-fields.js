import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const programsDir = path.join(projectRoot, 'data', 'programas');

console.log('🎬 Adding is_program field to program files...\n');

const programFiles = fs.readdirSync(programsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(programsDir, file));

console.log(`📁 Found ${programFiles.length} program files\n`);

let totalUpdated = 0;

programFiles.forEach(filePath => {
  const filename = path.basename(filePath);
  const programName = filename.replace('.json', '');
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (Array.isArray(data)) {
      let updated = 0;
      
      data.forEach(video => {
        // Add is_program field if not present
        if (!video.is_program) {
          video.is_program = true;
          updated++;
        }
        
        // Add program_name field if not present
        if (!video.program_name) {
          video.program_name = programName;
        }
      });
      
      if (updated > 0) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Updated ${filename}: ${updated} videos marked as programs`);
        totalUpdated += updated;
      } else {
        console.log(`✓ ${filename}: Already has is_program field`);
      }
    }
  } catch (err) {
    console.error(`❌ Error processing ${filename}: ${err.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✨ Program Field Addition Complete!\n');
console.log(`📊 Statistics:`);
console.log(`   - Files processed: ${programFiles.length}`);
console.log(`   - Videos updated: ${totalUpdated}`);
console.log('='.repeat(60));

console.log('\n✅ Next step:');
console.log('   - Regenerate index: npm run generate-index\n');
