async function searchImages(query, platform) {
  const searchQuery = `${query} ${platform}`;
  console.log(`\n========================================\nSearch: "${searchQuery}"`);
  
  // DDG
  try {
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(4000)
    });
    const html = await tokenRes.text();
    const vqd = html.match(/vqd=([a-zA-Z0-9_\-]+)/)?.[1];
    if (vqd) {
      const res = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(searchQuery)}&vqd=${vqd}&f=,,,&p=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://duckduckgo.com/',
        },
        signal: AbortSignal.timeout(4000)
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        console.log('DDG top result:', {
          title: data.results[0].title,
          image: data.results[0].image,
          source: data.results[0].source
        });
        return;
      }
    }
  } catch (e) {
    console.log('DDG error:', e.message);
  }

  // Bing fallback
  try {
    const bRes = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}&form=HDRSC2&first=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(4000)
    });
    const bHtml = await bRes.text();
    const murls = [...bHtml.matchAll(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
    if (murls.length > 0) {
      console.log('Bing top result:', murls[0]);
    }
  } catch (e) {
    console.log('Bing error:', e.message);
  }
}

async function run() {
  await searchImages('Impulse EmpowerElite Water Resistant Laptop Backpack Black', 'amazon');
  await searchImages('Apple iPhone 15 128 GB', 'amazon');
  await searchImages('Xn Xeezos 13 Bk Brecelet Led Analog Watch Men', 'flipkart');
  await searchImages('Realme P4x 5g Matte Silver 128 Gb', 'flipkart');
  await searchImages('Mivi Fort H350 Soundbar 350 Watts', 'flipkart');
  await searchImages('Roadster Men Solid Casual Shirt', 'myntra');
}

run();
