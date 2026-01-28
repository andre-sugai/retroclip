import fs from 'fs';
import path from 'path';

// Helper to read JSON
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'));

// Count Shows
const showFiles = fs.readdirSync('data/shows', { recursive: true }).filter(f => f.endsWith('.json'));
let totalShows = 0;
let showsBreakdown = {};

showFiles.forEach(f => {
  const content = readJson(path.join('data/shows', f));
  const count = content.length;
  totalShows += count;
  showsBreakdown[f] = count;
});

console.log('Total Shows:', totalShows);

// Count Programs
const progFiles = fs.readdirSync('data/programas').filter(f => f.endsWith('.json'));
let totalProgs = 0;
let progBreakdown = {};

progFiles.forEach(f => {
  const content = readJson(path.join('data/programas', f));
  const count = content.length;
  totalProgs += count;
  progBreakdown[f] = count;
});

console.log('Total Programs:', totalProgs);
console.log('Programs Breakdown:', progBreakdown);

// Count Clips
const clipFiles = fs.readdirSync('data/clipes', { recursive: true }).filter(f => f.endsWith('.json'));
let totalClips = 0;
clipFiles.forEach(f => {
  const content = readJson(path.join('data/clipes', f));
  totalClips += content.length;
});
console.log('Total Clips:', totalClips);

console.log('Grand Total:', totalShows + totalProgs + totalClips);
