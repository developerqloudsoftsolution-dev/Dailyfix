import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Building frontend production bundle with Vite...');
execSync('npm run build', {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const clientDist = path.join(__dirname, 'client', 'dist');
const serverDist = path.join(__dirname, 'server', 'dist');

console.log('🔄 Syncing client/dist to server/dist...');
fs.cpSync(clientDist, serverDist, { recursive: true, force: true });

console.log('✅ Build and sync complete! Ready for deployment.');
