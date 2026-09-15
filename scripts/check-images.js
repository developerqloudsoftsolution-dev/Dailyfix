import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function inspectDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) continue;
    if (/\.(png|jpe?g|webp)$/i.test(f)) {
      try {
        const meta = await sharp(full).metadata();
        console.log(`${f.padEnd(35)} : ${meta.width} x ${meta.height} (ratio: ${(meta.width / meta.height).toFixed(4)})`);
      } catch (e) {
        console.log(`Error reading ${f}: ${e.message}`);
      }
    }
  }
}

async function run() {
  console.log('--- client/public ---');
  await inspectDir('client/public');
  console.log('\n--- client/public/images ---');
  await inspectDir('client/public/images');
}

run();
