import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const imagesDir = path.join(projectRoot, 'client', 'public', 'images');
const publicDir = path.join(projectRoot, 'client', 'public');

export async function optimizeAllImages() {
  console.log('🖼️ Starting image optimization & Next-Gen WebP generation...');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Optimize dailyfix-logo.png
  const logoSrc = path.join(publicDir, 'dailyfix-logo.png');
  const logoWebp = path.join(publicDir, 'dailyfix-logo.webp');
  if (fs.existsSync(logoSrc)) {
    const meta = await sharp(logoSrc).metadata();
    await sharp(logoSrc)
      .resize({ width: Math.min(meta.width || 600, 600), withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(logoWebp);
    console.log(`  ✓ Converted logo to WebP: ${path.basename(logoWebp)}`);
  }

  // 2. Process all images in client/public/images/
  const files = fs.readdirSync(imagesDir).filter(f => /\.(png|jpe?g)$/i.test(f) && !f.endsWith('.webp'));

  for (const file of files) {
    const srcPath = path.join(imagesDir, file);
    const baseName = path.parse(file).name;
    const destWebpPath = path.join(imagesDir, `${baseName}.webp`);

    const meta = await sharp(srcPath).metadata();
    const origSize = fs.statSync(srcPath).size;

    // Constrain max width to 800px for optimal responsive delivery and tiny payload
    await sharp(srcPath)
      .resize({ width: Math.min(meta.width || 800, 800), withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(destWebpPath);

    const newSize = fs.statSync(destWebpPath).size;
    const savings = (((origSize - newSize) / origSize) * 100).toFixed(1);
    console.log(`  ✓ ${file} (${(origSize / 1024).toFixed(0)}KB) -> ${baseName}.webp (${(newSize / 1024).toFixed(0)}KB) [${savings}% smaller]`);
  }

  console.log('✅ Next-Gen WebP image optimization complete!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  optimizeAllImages().catch(err => {
    console.error('Optimization error:', err);
    process.exit(1);
  });
}
