import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'data', 'videos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Starting data migration to unified structure...\n');

// Track statistics
const stats = {
  filesProcessed: 0,
  videosProcessed: 0,
  yearsMerged: 0,
  errors: [],
};

/**
 * Get all JSON files from a directory
 */
function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return [];
  }
  
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json') && !file.includes('.backup') && file !== 'videos.json' && file !== 'videos_info.json')
    .map(file => path.join(dir, file));
}

/**
 * Extract year from filename
 */
function extractYear(filename) {
  const match = path.basename(filename).match(/^(\d{4})\.json$/);
  return match ? match[1] : null;
}

/**
 * Merge videos from global and brasil for a specific year
 */
function mergeYearData(year) {
  const globalClipsPath = path.join(projectRoot, 'data', 'clipes', 'global', `${year}.json`);
  const brasilClipsPath = path.join(projectRoot, 'data', 'clipes', 'brasil', `${year}.json`);
  const globalShowsPath = path.join(projectRoot, 'data', 'shows', 'global', `${year}.json`);
  const brasilShowsPath = path.join(projectRoot, 'data', 'shows', 'brasil', `${year}.json`);
  
  let mergedData = [];
  
  // Load global clips
  if (fs.existsSync(globalClipsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(globalClipsPath, 'utf8'));
      const withNationality = data.map(video => ({
        ...video,
        nationality: video.nationality || 'INTL',
        video_type: video.video_type || 'clip'
      }));
      mergedData.push(...withNationality);
      stats.videosProcessed += withNationality.length;
    } catch (err) {
      stats.errors.push(`Error reading ${globalClipsPath}: ${err.message}`);
    }
  }
  
  // Load brasil clips
  if (fs.existsSync(brasilClipsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(brasilClipsPath, 'utf8'));
      const withNationality = data.map(video => ({
        ...video,
        nationality: 'BR',
        video_type: video.video_type || 'clip'
      }));
      mergedData.push(...withNationality);
      stats.videosProcessed += withNationality.length;
    } catch (err) {
      stats.errors.push(`Error reading ${brasilClipsPath}: ${err.message}`);
    }
  }
  
  // Load global shows
  if (fs.existsSync(globalShowsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(globalShowsPath, 'utf8'));
      const withFlags = data.map(video => ({
        ...video,
        nationality: video.nationality || 'INTL',
        is_show: true,
        video_type: video.video_type || 'show'
      }));
      mergedData.push(...withFlags);
      stats.videosProcessed += withFlags.length;
    } catch (err) {
      stats.errors.push(`Error reading ${globalShowsPath}: ${err.message}`);
    }
  }
  
  // Load brasil shows
  if (fs.existsSync(brasilShowsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(brasilShowsPath, 'utf8'));
      const withFlags = data.map(video => ({
        ...video,
        nationality: 'BR',
        is_show: true,
        video_type: video.video_type || 'show'
      }));
      mergedData.push(...withFlags);
      stats.videosProcessed += withFlags.length;
    } catch (err) {
      stats.errors.push(`Error reading ${brasilShowsPath}: ${err.message}`);
    }
  }
  
  return mergedData;
}

/**
 * Process special files (record labels, festivals, etc.)
 */
function processSpecialFiles() {
  const specialFiles = [
    { src: 'data/clipes/global/atlantic.json', label: 'atlantic' },
    { src: 'data/clipes/global/road_runner.json', label: 'road_runner' },
    { src: 'data/clipes/global/subpop.json', label: 'subpop' },
    { src: 'data/clipes/global/epitaph.json', label: 'epitaph' },
  ];
  
  specialFiles.forEach(({ src, label }) => {
    const srcPath = path.join(projectRoot, src);
    const destPath = path.join(outputDir, `${label}.json`);
    
    if (fs.existsSync(srcPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
        const withMetadata = data.map(video => ({
          ...video,
          nationality: video.nationality || 'INTL',
          record_label: label,
          video_type: video.video_type || 'clip'
        }));
        
        fs.writeFileSync(destPath, JSON.stringify(withMetadata, null, 2));
        console.log(`✅ Processed ${label}.json (${withMetadata.length} videos)`);
        stats.filesProcessed++;
        stats.videosProcessed += withMetadata.length;
      } catch (err) {
        stats.errors.push(`Error processing ${src}: ${err.message}`);
      }
    }
  });
}

/**
 * Copy program files (they don't need merging)
 */
function copyProgramFiles() {
  const programsDir = path.join(projectRoot, 'data', 'programas');
  const programFiles = getJsonFiles(programsDir);
  
  programFiles.forEach(srcPath => {
    const filename = path.basename(srcPath);
    const destPath = path.join(outputDir, filename);
    
    try {
      const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
      const programName = filename.replace('.json', '');
      
      const withMetadata = data.map(video => ({
        ...video,
        nationality: video.nationality || 'BR',
        is_program: true,
        program_name: programName,
        video_type: 'program'
      }));
      
      fs.writeFileSync(destPath, JSON.stringify(withMetadata, null, 2));
      console.log(`✅ Copied ${filename} (${withMetadata.length} videos)`);
      stats.filesProcessed++;
      stats.videosProcessed += withMetadata.length;
    } catch (err) {
      stats.errors.push(`Error copying ${srcPath}: ${err.message}`);
    }
  });
}

/**
 * Main migration function
 */
function migrate() {
  console.log('📁 Collecting all years from source directories...\n');
  
  // Collect all unique years
  const years = new Set();
  
  const globalClipsDir = path.join(projectRoot, 'data', 'clipes', 'global');
  const brasilClipsDir = path.join(projectRoot, 'data', 'clipes', 'brasil');
  const globalShowsDir = path.join(projectRoot, 'data', 'shows', 'global');
  const brasilShowsDir = path.join(projectRoot, 'data', 'shows', 'brasil');
  
  [globalClipsDir, brasilClipsDir, globalShowsDir, brasilShowsDir].forEach(dir => {
    getJsonFiles(dir).forEach(file => {
      const year = extractYear(file);
      if (year) years.add(year);
    });
  });
  
  console.log(`📅 Found ${years.size} unique years\n`);
  
  // Process each year
  const sortedYears = Array.from(years).sort();
  sortedYears.forEach(year => {
    const mergedData = mergeYearData(year);
    
    if (mergedData.length > 0) {
      const outputPath = path.join(outputDir, `${year}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
      
      const intlCount = mergedData.filter(v => v.nationality === 'INTL').length;
      const brCount = mergedData.filter(v => v.nationality === 'BR').length;
      const showCount = mergedData.filter(v => v.is_show).length;
      
      console.log(`✅ ${year}.json: ${mergedData.length} videos (INTL: ${intlCount}, BR: ${brCount}, Shows: ${showCount})`);
      stats.filesProcessed++;
      stats.yearsMerged++;
    }
  });
  
  console.log('\n📦 Processing special files (record labels)...\n');
  processSpecialFiles();
  
  console.log('\n📺 Copying program files...\n');
  copyProgramFiles();
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Migration Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Files created: ${stats.filesProcessed}`);
  console.log(`   - Years merged: ${stats.yearsMerged}`);
  console.log(`   - Total videos processed: ${stats.videosProcessed}`);
  console.log(`   - Output directory: ${outputDir}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach(err => console.log(`   - ${err}`));
  }
  
  console.log('='.repeat(60));
  console.log('\n✅ Next steps:');
  console.log('   1. Run: node scripts/generate-index.js');
  console.log('   2. Test the application: npm run dev');
  console.log('   3. Verify all features work correctly');
  console.log('   4. Remove old directories after verification\n');
}

// Run migration
migrate();
