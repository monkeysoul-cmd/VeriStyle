async function testPriceFromSearch(query, platform) {
  const searchQuery = `${query} ${platform} price`;
  console.log(`\n========================================\nSearch: "${searchQuery}"`);

  // DuckDuckGo Text Search
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(5000)
    });
    const text = await res.text();
    console.log('DDG HTML length:', text.length);
    
    // Look for snippets and price matches
    const snippets = [...text.matchAll(/<a class="result__snippet[^>]*>(.*?)<\/a>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('Found snippets:', snippets.length);
    for (let i = 0; i < Math.min(3, snippets.length); i++) {
      console.log(`Snippet [${i}]:`, snippets[i]);
      const priceMatches = [...snippets[i].matchAll(/(?:₹|Rs\.?|INR|\$|€|£)\s*[\d,]+(?:\.\d{2})?/gi)];
      if (priceMatches.length > 0) {
        console.log('   Price matches in snippet:', priceMatches.map(m => m[0]));
      }
    }
  } catch (e) {
    console.log('DDG error:', e.message);
  }
}

async function run() {
  await testPriceFromSearch('Impulse EmpowerElite Water Resistant Laptop Backpack Black', 'amazon');
  await testPriceFromSearch('Xn Xeezos 13 Bk Brecelet Led Analog Watch Men', 'flipkart');
  await testPriceFromSearch('Realme P4x 5g Matte Silver 128 Gb', 'flipkart');
  await testPriceFromSearch('Mivi Fort H350 Soundbar 350 Watts', 'flipkart');
  await testPriceFromSearch('Lakhya Watch Analog Men', 'flipkart');
}

run();
