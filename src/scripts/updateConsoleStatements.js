#!/usr/bin/env node

// This script replaces console statements with optimizedLog
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../');

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Add import if not present and console statements exist
  let updatedContent = content;
  
  if (content.includes('console.') && !content.includes('optimizedLog')) {
    // Add import at the top
    const lines = content.split('\n');
    let importIndex = -1;
    
    // Find where to insert the import
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        importIndex = i;
      } else if (importIndex !== -1 && !lines[i].startsWith('import ') && lines[i].trim() !== '') {
        break;
      }
    }
    
    if (importIndex !== -1) {
      lines.splice(importIndex + 1, 0, "import { optimizedLog } from '@/utils/performanceOptimization';");
    }
    
    updatedContent = lines.join('\n');
    
    // Replace console statements
    updatedContent = updatedContent
      .replace(/console\.log\(/g, 'optimizedLog.log(')
      .replace(/console\.warn\(/g, 'optimizedLog.warn(')
      .replace(/console\.error\(/g, 'optimizedLog.error(')
      .replace(/console\.info\(/g, 'optimizedLog.info(');
      
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      processDirectory(fullPath);
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      updateFile(fullPath);
    }
  }
}

console.log('Starting console statement updates...');
processDirectory(srcDir);
console.log('Console statement updates complete!');