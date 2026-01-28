import fs from 'fs';
import path from 'path';

// Get all JSON files in data/clipes/global
const globalFiles = fs.readdirSync('data/clipes/global')
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

// Get all JSON files in data/clipes/brasil
const brasilFiles = fs.readdirSync('data/clipes/brasil')
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

// Read imvdbService.ts
const serviceContent = fs.readFileSync('services/imvdbService.ts', 'utf-8');

console.log('=== GLOBAL CLIPS ===');
globalFiles.forEach(year => {
  const importPattern = `import data${year} from '../data/clipes/global/${year}.json'`;
  const usagePattern = `...data${year}`;
  
  const hasImport = serviceContent.includes(importPattern);
  const hasUsage = serviceContent.includes(usagePattern);
  
  if (!hasImport || !hasUsage) {
    console.log(`❌ ${year}.json - Import: ${hasImport}, Usage: ${hasUsage}`);
  }
});

console.log('\n=== BRASIL CLIPS ===');
brasilFiles.forEach(year => {
  const importPattern = `import data${year}BR from '../data/clipes/brasil/${year}.json'`;
  const usagePattern = `...data${year}BR`;
  
  const hasImport = serviceContent.includes(importPattern);
  const hasUsage = serviceContent.includes(usagePattern);
  
  if (!hasImport || !hasUsage) {
    console.log(`❌ ${year}.json - Import: ${hasImport}, Usage: ${hasUsage}`);
  }
});
