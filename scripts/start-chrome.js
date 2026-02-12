/**
 * Start Chrome with remote debugging for PDF generation
 * This allows the printer service to connect to a local Chrome instance
 * 
 * Usage: node scripts/start-chrome.js
 */

import { spawn } from 'child_process';
import { platform } from 'os';

const PORT = 4000;

// Chrome executable paths for different platforms
const CHROME_PATHS = {
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ],
};

function findChrome() {
  const paths = CHROME_PATHS[platform()] || [];
  
  for (const path of paths) {
    try {
      // Check if file exists
      const fs = require('fs');
      if (fs.existsSync(path)) {
        return path;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  return null;
}

function startChrome() {
  const chromePath = findChrome();
  
  if (!chromePath) {
    console.error('❌ Chrome not found. Please install Google Chrome or Chromium.');
    console.error('   Download from: https://www.google.com/chrome/');
    process.exit(1);
  }
  
  console.log(`✓ Found Chrome at: ${chromePath}`);
  console.log(`✓ Starting Chrome with remote debugging on port ${PORT}...`);
  
  const args = [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    'about:blank',
  ];
  
  const chrome = spawn(chromePath, args, {
    stdio: 'inherit',
    detached: false,
  });
  
  chrome.on('error', (err) => {
    console.error('❌ Failed to start Chrome:', err);
    process.exit(1);
  });
  
  chrome.on('exit', (code) => {
    console.log(`Chrome exited with code ${code}`);
  });
  
  console.log('✓ Chrome is running!');
  console.log(`✓ PDF generation service is available at: http://localhost:${PORT}`);
  console.log('✓ Press Ctrl+C to stop');
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n✓ Stopping Chrome...');
    chrome.kill();
    process.exit(0);
  });
}

startChrome();
