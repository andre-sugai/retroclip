// Simulate what imvdbService.ts does
import fs from 'fs';
import path from 'path';

const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf-8'));

// Count INTL clips
const intlClipFiles = fs.readdirSync('data/clipes/global').filter(f => f.endsWith('.json'));
let intlClips = 0;
intlClipFiles.forEach(f => {
  intlClips += readJson(path.join('data/clipes/global', f)).length;
});

// Count INTL shows
const intlShowFiles = fs.readdirSync('data/shows/global').filter(f => f.endsWith('.json'));
let intlShows = 0;
intlShowFiles.forEach(f => {
  intlShows += readJson(path.join('data/shows/global', f)).length;
});

const INTL_DATA_COUNT = intlClips + intlShows;

// Count BR clips
const brClipFiles = fs.readdirSync('data/clipes/brasil').filter(f => f.endsWith('.json'));
let brClips = 0;
brClipFiles.forEach(f => {
  brClips += readJson(path.join('data/clipes/brasil', f)).length;
});

// Count BR shows
const brShowFiles = fs.readdirSync('data/shows/brasil').filter(f => f.endsWith('.json'));
let brShows = 0;
brShowFiles.forEach(f => {
  brShows += readJson(path.join('data/shows/brasil', f)).length;
});

// Count Programs
const progFiles = ['hermes_e_renato.json', 'beavis_and_butthead.json', 'documentarios.json'];
let programs = 0;
progFiles.forEach(f => {
  programs += readJson(path.join('data/programas', f)).length;
});

const BR_DATA_COUNT = brClips + brShows + programs;

console.log('INTL_DATA (clips + shows):', INTL_DATA_COUNT);
console.log('  - Clips:', intlClips);
console.log('  - Shows:', intlShows);
console.log('');
console.log('BR_DATA (clips + shows + programs):', BR_DATA_COUNT);
console.log('  - Clips:', brClips);
console.log('  - Shows:', brShows);
console.log('  - Programs:', programs);
console.log('');
console.log('TOTAL (INTL + BR):', INTL_DATA_COUNT + BR_DATA_COUNT);
