import fs from 'fs';

const files = [
  'data/clipes/global/videos.json',
  'data/clipes/global/videos_info.json',
  'data/clipes/brasil/videos.json',
  'data/clipes/brasil/videos_info.json'
];

let total = 0;
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = JSON.parse(fs.readFileSync(f, 'utf-8'));
    const count = Array.isArray(content) ? content.length : 0;
    console.log(`${f}: ${count} videos`);
    total += count;
  } else {
    console.log(`${f}: NOT FOUND`);
  }
});

console.log(`\nTotal unimported videos: ${total}`);
console.log(`Expected difference: 98797 - 92324 = ${98797 - 92324}`);
