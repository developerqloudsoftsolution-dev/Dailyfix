import fs from 'fs';

const paths = [
  'dist/index.html',
  'dist/about/index.html',
  'dist/shop/index.html',
  'dist/beard-colour-for-men/index.html',
  'dist/product/natural-black/index.html',
  'dist/product/black-brown/index.html',
  'dist/product/dark-brown/index.html',
  'dist/blog/index.html',
  'dist/blog/choose-right-beard-colour-shade/index.html',
  'dist/blog/10-beard-grooming-mistakes/index.html',
  'dist/contact/index.html',
  'dist/store-locator/index.html',
  'dist/beard-oil/index.html',
  'dist/privacy-policy/index.html',
  'dist/terms-of-service/index.html',
  'dist/shipping-policy/index.html',
  'dist/return-policy/index.html',
  'dist/track-order/index.html'
];

console.log('='.repeat(80));
console.log('SEO AUDIT VERIFICATION OF PRE-RENDERED PAGES');
console.log('='.repeat(80));

for (const p of paths) {
  if (!fs.existsSync(p)) {
    console.error(`❌ MISSING: ${p}`);
    continue;
  }
  const t = fs.readFileSync(p, 'utf8');
  const title = t.match(/<title>([\s\S]*?)<\/title>/i);
  const desc = t.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const h1 = t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const canonical = t.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const imgs = t.match(/<img[^>]*>/gi) || [];

  console.log(`\n📄 ${p}`);
  console.log(`   Title: ${title ? title[1].trim() : 'MISSING'}`);
  console.log(`   H1: ${h1 ? h1[1].trim() : 'MISSING'}`);
  console.log(`   Description: ${desc ? desc[1].trim().slice(0, 70) + '...' : 'MISSING'}`);
  console.log(`   Canonical: ${canonical ? canonical[1] : 'MISSING'}`);
  console.log(`   Images Count: ${imgs.length}`);
  imgs.forEach((imgTag, idx) => {
    const src = (imgTag.match(/src=["'](.*?)["']/i) || [])[1] || 'NO_SRC';
    const alt = (imgTag.match(/alt=["'](.*?)["']/i) || [])[1] || 'NO_ALT';
    console.log(`     [Img ${idx + 1}] src="${src}" | alt="${alt}"`);
  });
}
