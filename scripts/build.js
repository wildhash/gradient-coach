#!/usr/bin/env node

/**
 * Cross-platform build script
 * Compiles TypeScript and copies knowledge base files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building TypeScript...');
try {
  execSync('tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}

console.log('📦 Copying knowledge base files...');
const sourceDir = path.join(__dirname, '..', 'src', 'knowledge');
const targetDir = path.join(__dirname, '..', 'dist', 'knowledge');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy JSON files
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));
for (const file of files) {
  const source = path.join(sourceDir, file);
  const target = path.join(targetDir, file);
  fs.copyFileSync(source, target);
  console.log(`  ✅ Copied ${file}`);
}

console.log('✨ Build complete!');
