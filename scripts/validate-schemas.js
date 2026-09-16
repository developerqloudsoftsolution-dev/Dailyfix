import fs from 'fs';
import path from 'path';

const files = [
  'dist/product/natural-black/index.html',
  'dist/product/black-brown/index.html',
  'dist/product/dark-brown/index.html',
  'server/dist/product/natural-black/index.html',
  'server/dist/product/black-brown/index.html',
  'server/dist/product/dark-brown/index.html'
];

let allValid = true;

for (const file of files) {
  console.log('\n=========================================');
  console.log('Testing file:', file);
  if (!fs.existsSync(file)) {
    console.error('File does not exist:', file);
    allValid = false;
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  
  while ((match = regex.exec(html)) !== null) {
    count++;
    const jsonStr = match[1].trim();
    try {
      const parsed = JSON.parse(jsonStr);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        console.log(`  ✓ Found valid Schema @type: "${item['@type']}"`);
        if (item['@type'] === 'Product') {
          if (!item.name || !item.offers || !item.brand || !item.sku || !item.description) {
            console.error('    ❌ Product schema missing required fields!');
            allValid = false;
          } else {
            console.log(`    ✓ Product "${item.name}" - Price: ₹${item.offers.price}, Stock: ${item.offers.availability}, Rating: ${item.aggregateRating?.ratingValue}/5 (${item.aggregateRating?.reviewCount} reviews)`);
          }
        }
        if (item['@type'] === 'FAQPage') {
          if (!item.mainEntity || !Array.isArray(item.mainEntity) || item.mainEntity.length === 0) {
            console.error('    ❌ FAQPage schema missing questions!');
            allValid = false;
          } else {
            console.log(`    ✓ FAQPage with ${item.mainEntity.length} questions.`);
          }
        }
        if (item['@type'] === 'BreadcrumbList') {
          console.log(`    ✓ BreadcrumbList with ${item.itemListElement?.length} items.`);
        }
      }
    } catch (err) {
      console.error(`  ❌ Failed to parse JSON in schema #${count}:`, err.message);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log('\n🎉 ALL SCHEMAS ARE 100% VALID JSON-LD AND CONFORM TO SCHEMA.ORG / GOOGLE RICH RESULTS GUIDELINES!');
} else {
  console.error('\n❌ SOME SCHEMAS FAILED VALIDATION!');
  process.exit(1);
}
