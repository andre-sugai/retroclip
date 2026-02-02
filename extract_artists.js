
import fs from 'fs';
import path from 'path';

const filePath = '/Users/andresugai/Desktop/PROJETOS/retroclip/data/shows/global/classic.json';

try {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const items = JSON.parse(rawData);
  let updatedCount = 0;

  const updatedItems = items.map((item) => {
    // Only process if artist_name is "Full Concert" or empty
    if (item.artist_name === 'Full Concert' || !item.artist_name) {
      let originalTitle = item.song_title;
      let newArtist = '';
      let newTitle = originalTitle;

      // Heuristic 1: " - " separator (most common)
      if (originalTitle.includes(' - ')) {
        const parts = originalTitle.split(' - ');
        newArtist = parts[0].trim();
        newTitle = parts.slice(1).join(' - ').trim();
      } 
      // Heuristic 2: ": " separator
      else if (originalTitle.includes(': ')) {
        const parts = originalTitle.split(': ');
        newArtist = parts[0].trim();
        newTitle = parts.slice(1).join(': ').trim();
      }
      // Heuristic 3: Check for "Live" or "Concert" usage without clear separator
      // This is risky, let's stick to delimiters first. 
      // Many titles are just "ArtistName Live at..."
      else {
        // Fallback for some obvious patterns seen in the file
        // "T.Rex - ..." (handled by Heuristic 1)
        // "Rolling Stones 22nd May..." -> Hard to split programmatically without a dictionary
        // "Queen In The 70s" -> Hard
        
        // Let's look for "Live" as a splitter?
        const liveIndex = originalTitle.toLowerCase().indexOf(' live');
        if (liveIndex > 3) { // changing strict > 0 to > 3 to avoid short words
             newArtist = originalTitle.substring(0, liveIndex).trim();
             newTitle = originalTitle.substring(liveIndex).trim();
        }
      }

      if (newArtist && newArtist.length > 1 && newArtist.length < 50) {
        // Sanity check on length
        item.artist_name = newArtist;
        item.song_title = newTitle;
        updatedCount++;
      }
    }
    return item;
  });

  fs.writeFileSync(filePath, JSON.stringify(updatedItems, null, 2));
  console.log(`Successfully updated ${updatedCount} items.`);

} catch (error) {
  console.error('Error processing file:', error);
}
