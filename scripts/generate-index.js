import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const videosDir = path.join(projectRoot, 'data', 'videos');
const programsDir = path.join(projectRoot, 'data', 'programas');
const outputPath = path.join(projectRoot, 'services', 'metadata-index.json');

console.log('🔍 Generating metadata index...\n');

// Initialize index structure
const index = {
  byYear: {},
  byGenre: {},
  byNationality: {},
  byFestival: {},
  byLabel: {},
  byProgram: {},
  metadata: {
    totalVideos: 0,
    totalClips: 0,
    totalShows: 0,
    totalPrograms: 0,
    lastGenerated: new Date().toISOString(),
    dataVersion: '2.0'
  }
};

// Genre mapping for classification
const GENRE_MAP = {
  'Rock Alternativo': ['Alternative Rock', 'Grunge', 'Indie Rock', 'Post-Grunge', 'Shoegaze', 'Britpop', 'Folk Rock', 'Alternative', 'Rock Alternativo'],
  'Punk': ['Punk', 'Pop Punk', 'Ska Punk', 'Hardcore'],
  'Metal': ['Metal', 'Heavy Metal', 'Thrash Metal', 'Nu Metal', 'Industrial Metal', 'Groove Metal', 'Death Metal', 'Black Metal'],
  'Rap': ['Hip Hop', 'Rap', 'Gangsta Rap', 'Alternative Hip Hop', 'Jazz Rap'],
  'Pop': ['Pop', 'Pop Rock', 'Synth-pop', 'Teen Pop', 'Dance-Pop', 'Europop', 'Boy Band', 'Girl Group'],
  'Dance': ['Dance', 'Eurodance', 'House', 'Techno', 'Trance', 'Electronic', 'Disco'],
  'Eletronico': ['Electronic', 'Techno', 'Trance', 'House', 'Big Beat', 'Trip Hop', 'Electronica', 'Industrial', 'Drum and Bass', 'Jungle'],
  'Hard Rock': ['Hard Rock', 'Glam Metal', 'Stoner Rock'],
  'Hardcore': ['Hardcore', 'Hardcore Punk', 'Post-Hardcore'],
  'Industrial': ['Industrial', 'Industrial Metal', 'Industrial Rock'],
  'Nu Metal': ['Nu Metal', 'Rap Metal', 'Alternative Metal'],
  'Indie': ['Indie', 'Indie Rock', 'Indie Pop', 'Garage Rock', 'Shoegaze', 'Britpop'],
  'Rock': ['Rock', 'Classic Rock', 'Rock and Roll', 'Southern Rock'],
  'R&B': ['R&B', 'Soul', 'Funk', 'Neo-Soul', 'Contemporary R&B'],
  'Latin Pop': ['Latin Pop', 'Latin', 'Reggaeton', 'Latin Rock'],
  'K-Pop': ['K-Pop', 'Korean Pop'],
  'Folk': ['Folk', 'Folk Rock', 'Indie Folk', 'Contemporary Folk'],
  'Gótico': ['Gótico', 'Goth', 'Gothic Rock', 'Dark Wave', 'Post-Punk', 'Ethereal Wave', 'Gothic Metal'],
  'Ska': ['Ska', 'Ska Punk', 'Two Tone', 'Rocksteady'],
  'Reggae': ['Reggae', 'Reggaeton']
};

/**
 * Get all JSON files from a directory
 */
function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dir, file));
}

/**
 * Extract year from filename
 */
function extractYear(filename) {
  const match = path.basename(filename).match(/^(\d{4})\.json$/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Determine which genre category a video belongs to
 */
function categorizeGenre(artistGenre) {
  if (!artistGenre) return null;
  
  for (const [category, keywords] of Object.entries(GENRE_MAP)) {
    if (keywords.some(keyword => artistGenre.includes(keyword) || artistGenre === keyword)) {
      return category;
    }
  }
  
  return null;
}

/**
 * Process a single video and update index
 */
function processVideo(video, sourceFile) {
  index.metadata.totalVideos++;
  
  const year = video.year;
  const nationality = video.nationality || 'INTL';
  const artistGenre = video.artist_genre;
  const festival = video.festival || (video.video_tags && video.video_tags.find(tag => tag === 'pinkpop'));
  const recordLabel = video.record_label;
  const isShow = video.is_show === true;
  const isProgram = video.is_program === true;
  const programName = video.program_name;
  
  // Count by type
  if (isProgram) {
    index.metadata.totalPrograms++;
  } else if (isShow) {
    index.metadata.totalShows++;
  } else {
    index.metadata.totalClips++;
  }
  
  // Index by year
  if (year) {
    if (!index.byYear[year]) {
      index.byYear[year] = {
        count: 0,
        genres: new Set(),
        nationalities: new Set(),
        hasShows: false,
        hasClips: false,
        hasPrograms: false
      };
    }
    
    index.byYear[year].count++;
    index.byYear[year].nationalities.add(nationality);
    
    if (isShow) index.byYear[year].hasShows = true;
    if (isProgram) index.byYear[year].hasPrograms = true;
    if (!isShow && !isProgram) index.byYear[year].hasClips = true;
  }
  
  // Index by nationality
  if (nationality) {
    if (!index.byNationality[nationality]) {
      index.byNationality[nationality] = {
        years: new Set(),
        count: 0,
        genres: new Set()
      };
    }
    
    index.byNationality[nationality].count++;
    if (year) index.byNationality[nationality].years.add(year);
    if (artistGenre) index.byNationality[nationality].genres.add(artistGenre);
  }
  
  // Index by genre
  if (artistGenre) {
    const genreCategory = categorizeGenre(artistGenre);
    
    if (genreCategory) {
      if (!index.byGenre[genreCategory]) {
        index.byGenre[genreCategory] = {
          years: new Set(),
          files: new Set(),
          count: 0,
          nationalities: new Set()
        };
      }
      
      index.byGenre[genreCategory].count++;
      if (year) index.byGenre[genreCategory].years.add(year);
      index.byGenre[genreCategory].files.add(path.basename(sourceFile));
      index.byGenre[genreCategory].nationalities.add(nationality);
    }
    
    // Also add to year's genres
    if (year && genreCategory) {
      index.byYear[year].genres.add(genreCategory);
    }
  }
  
  // Index by festival
  if (festival) {
    if (!index.byFestival[festival]) {
      index.byFestival[festival] = {
        years: new Set(),
        count: 0,
        files: new Set()
      };
    }
    
    index.byFestival[festival].count++;
    if (year) index.byFestival[festival].years.add(year);
    index.byFestival[festival].files.add(path.basename(sourceFile));
  }
  
  // Index by record label
  if (recordLabel) {
    if (!index.byLabel[recordLabel]) {
      index.byLabel[recordLabel] = {
        count: 0,
        genres: new Set(),
        years: new Set()
      };
    }
    
    index.byLabel[recordLabel].count++;
    if (artistGenre) {
      const genreCategory = categorizeGenre(artistGenre);
      if (genreCategory) index.byLabel[recordLabel].genres.add(genreCategory);
    }
    if (year) index.byLabel[recordLabel].years.add(year);
  }
  
  // Index by program
  if (isProgram && programName) {
    if (!index.byProgram[programName]) {
      index.byProgram[programName] = {
        count: 0,
        file: path.basename(sourceFile)
      };
    }
    
    index.byProgram[programName].count++;
  }
  
  // Check for Classics (1960-1999)
  if (year && year >= 1960 && year <= 1999) {
    if (!index.byGenre['Clássicos']) {
      index.byGenre['Clássicos'] = {
        years: new Set(),
        files: new Set(),
        count: 0,
        nationalities: new Set()
      };
    }
    
    index.byGenre['Clássicos'].count++;
    index.byGenre['Clássicos'].years.add(year);
    index.byGenre['Clássicos'].files.add(path.basename(sourceFile));
    index.byGenre['Clássicos'].nationalities.add(nationality);
  }
}

/**
 * Convert Sets to sorted Arrays for JSON serialization
 */
function convertSetsToArrays(obj) {
  if (obj instanceof Set) {
    return Array.from(obj).sort((a, b) => {
      // Sort numbers numerically, strings alphabetically
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      return String(a).localeCompare(String(b));
    });
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertSetsToArrays);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertSetsToArrays(value);
    }
    return converted;
  }
  
  return obj;
}

/**
 * Main index generation function
 */
function generateIndex() {
  // Process video files
  const videoFiles = getJsonFiles(videosDir);
  
  console.log(`📁 Processing ${videoFiles.length} video files...\n`);
  
  videoFiles.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const filename = path.basename(file);
      
      if (Array.isArray(data)) {
        data.forEach(video => processVideo(video, file));
        console.log(`✅ Processed ${filename}: ${data.length} videos`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}: ${err.message}`);
    }
  });
  
  // Process program files (if they exist in old location)
  if (fs.existsSync(programsDir)) {
    const programFiles = getJsonFiles(programsDir);
    
    if (programFiles.length > 0) {
      console.log(`\n📺 Processing ${programFiles.length} program files...\n`);
      
      programFiles.forEach(file => {
        try {
          const data = JSON.parse(fs.readFileSync(file, 'utf8'));
          const filename = path.basename(file);
          
          if (Array.isArray(data)) {
            data.forEach(video => processVideo(video, file));
            console.log(`✅ Processed ${filename}: ${data.length} videos`);
          }
        } catch (err) {
          console.error(`❌ Error processing ${file}: ${err.message}`);
        }
      });
    }
  }
  
  // Convert Sets to Arrays
  const finalIndex = convertSetsToArrays(index);
  
  // Write index to file
  fs.writeFileSync(outputPath, JSON.stringify(finalIndex, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Index Generation Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Total videos: ${finalIndex.metadata.totalVideos}`);
  console.log(`   - Clips: ${finalIndex.metadata.totalClips}`);
  console.log(`   - Shows: ${finalIndex.metadata.totalShows}`);
  console.log(`   - Programs: ${finalIndex.metadata.totalPrograms}`);
  console.log(`   - Years covered: ${Object.keys(finalIndex.byYear).length}`);
  console.log(`   - Genres indexed: ${Object.keys(finalIndex.byGenre).length}`);
  console.log(`   - Record labels: ${Object.keys(finalIndex.byLabel).length}`);
  console.log(`   - Festivals: ${Object.keys(finalIndex.byFestival).length}`);
  console.log(`   - Programs: ${Object.keys(finalIndex.byProgram).length}`);
  console.log(`   - Output: ${outputPath}`);
  console.log('='.repeat(60) + '\n');
}

// Run index generation
generateIndex();
