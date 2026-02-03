import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');

let totalVideos = 0;
let totalClips = 0;
let totalShows = 0;
let totalPrograms = 0;
let intlVideos = 0;
let brVideos = 0;

const countVideosInDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return { total: 0, intl: 0, br: 0, clips: 0, shows: 0, programs: 0 };
  }
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let total = 0;
  let intl = 0;
  let br = 0;
  let clips = 0;
  let shows = 0;
  let programs = 0;
  
  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
      if (!Array.isArray(data)) return;
      
      data.forEach(video => {
        total++;
        
        // Count by nationality
        if (video.nationality === 'BR') {
          br++;
        } else {
          intl++;
        }
        
        // Count by type
        if (video.is_program) {
          programs++;
        } else if (video.is_show) {
          shows++;
        } else {
          clips++;
        }
      });
    } catch (error) {
      console.warn(`Error reading ${file}:`, error.message);
    }
  });
  
  return { total, intl, br, clips, shows, programs };
};

console.log('📊 Counting videos in unified data structure...\n');

// Count videos directory (contains clips, shows, and labels)
const videosDir = path.join(dataDir, 'videos');
const videosCount = countVideosInDir(videosDir);
console.log(`✓ Videos directory: ${videosCount.total} videos`);
console.log(`  - Clips: ${videosCount.clips}`);
console.log(`  - Shows: ${videosCount.shows}`);
console.log(`  - INTL: ${videosCount.intl}`);
console.log(`  - BR: ${videosCount.br}`);

// Count programs directory
const programsDir = path.join(dataDir, 'programas');
const programsCount = countVideosInDir(programsDir);
console.log(`✓ Programs directory: ${programsCount.total} videos`);

totalVideos = videosCount.total + programsCount.total;
totalClips = videosCount.clips;
totalShows = videosCount.shows;
totalPrograms = videosCount.programs + programsCount.programs;
intlVideos = videosCount.intl;
brVideos = videosCount.br + programsCount.br;

const metadata = {
  totalVideos,
  totalClips,
  totalShows,
  totalPrograms,
  intlVideos,
  brVideos,
  generatedAt: new Date().toISOString()
};

const outputPath = path.join(__dirname, '../services/metadata.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(metadata, null, 2)
);

console.log('\n✅ Metadata generated successfully!');
console.log('📁 Output:', outputPath);
console.log('\n📈 Summary:');
console.log(`   Total Videos: ${totalVideos.toLocaleString()}`);
console.log(`   Total Clips: ${totalClips.toLocaleString()}`);
console.log(`   Total Shows: ${totalShows.toLocaleString()}`);
console.log(`   Total Programs: ${totalPrograms.toLocaleString()}`);
console.log(`   International: ${intlVideos.toLocaleString()}`);
console.log(`   Brasil: ${brVideos.toLocaleString()}`);
