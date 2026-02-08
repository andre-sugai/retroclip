import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Artist {
  count: number;
}

interface MetadataIndex {
  byYear: any;
  byGenre: any;
  byNationality: any;
  byFestival: any;
  byProgram: any;
  byArtist?: Record<string, Artist>;
  metadata: {
    totalVideos: number;
    totalClips: number;
    totalShows: number;
    totalPrograms: number;
    lastGenerated: string;
    dataVersion: string;
  };
}

async function addArtistsToIndex() {
  console.log('🎵 Adding artist index to metadata-index.json...');

  // Load metadata-index.json
  const indexPath = path.join(__dirname, '../services/metadata-index.json');
  const metadataIndex: MetadataIndex = JSON.parse(
    fs.readFileSync(indexPath, 'utf-8')
  );

  // Collect all artists from all year files
  const artistCounts: Record<string, number> = {};
  const dataDir = path.join(__dirname, '../data/videos');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

  console.log(`📂 Processing ${files.length} video files...`);

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const videos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    videos.forEach((video: any) => {
      const artist = video.artist || video.artist_name;
      if (artist && artist !== 'Unknown' && artist.trim() !== '') {
        const artistName = String(artist).trim();
        if (artistCounts[artistName]) {
          artistCounts[artistName]++;
        } else {
          artistCounts[artistName] = 1;
        }
      }
    });
  }

  // Convert to the format needed for the index
  const byArtist: Record<string, Artist> = {};
  Object.entries(artistCounts)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically
    .forEach(([name, count]) => {
      byArtist[name] = { count };
    });

  // Add to metadata index
  metadataIndex.byArtist = byArtist;
  metadataIndex.metadata.lastGenerated = new Date().toISOString();

  // Save updated index
  fs.writeFileSync(indexPath, JSON.stringify(metadataIndex, null, 2), 'utf-8');

  console.log(`✅ Added ${Object.keys(byArtist).length} artists to index`);
  console.log(`📊 Top 10 artists by clip count:`);

  Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([name, count], index) => {
      console.log(`   ${index + 1}. ${name}: ${count} clips`);
    });
}

addArtistsToIndex().catch(console.error);
