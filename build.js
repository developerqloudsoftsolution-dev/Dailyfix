import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, 'client');
const clientNodeModules = path.join(clientDir, 'node_modules');

if (!fs.existsSync(clientNodeModules)) {
  console.log('📦 Installing client dependencies...');
  execSync('npm install', {
    cwd: clientDir,
    stdio: 'inherit',
    shell: true
  });
}

console.log('📦 Building frontend production bundle with Vite...');
execSync('npm run build', {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

const clientDist = path.join(clientDir, 'dist');
const rootDist = path.join(__dirname, 'dist');
const serverDist = path.join(__dirname, 'server', 'dist');

console.log('🔄 Syncing dist to root dist/ and server/dist/ ...');
fs.cpSync(clientDist, rootDist, { recursive: true, force: true });
fs.cpSync(clientDist, serverDist, { recursive: true, force: true });

console.log('✅ Build and sync complete! Ready for deployment.');
