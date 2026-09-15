const routes = [
  '/',
  '/about',
  '/shop',
  '/product/natural-black',
  '/product/black-brown',
  '/product/dark-brown',
  '/blog',
  '/contact',
  '/privacy-policy'
];

async function run() {
  console.log('Testing live server HTTP requests on http://localhost:5000:');
  for (const p of routes) {
    try {
      const res = await fetch('http://localhost:5000' + p);
      const text = await res.text();
      const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i);
      const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const canonicalMatch = text.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
      const imgsMatch = text.match(/<img[^>]*>/gi) || [];

      console.log(`\nURL: ${p} (Status ${res.status})`);
      console.log(`  Title: ${titleMatch ? titleMatch[1].trim() : 'NONE'}`);
      console.log(`  H1: ${h1Match ? h1Match[1].trim() : 'NONE'}`);
      console.log(`  Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NONE'}`);
      console.log(`  Images: ${imgsMatch.length}`);
    } catch (err) {
      console.error(`Failed ${p}:`, err.message);
    }
  }
}

run();
