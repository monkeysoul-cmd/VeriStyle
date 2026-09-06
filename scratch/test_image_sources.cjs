async function testImageSources() {
  const query = 'realme p4x 5g matte silver 128 gb flipkart';
  console.log('Testing image sources for:', query);

  // 1. DuckDuckGo Image Search
  try {
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      }
    });
    const html = await tokenRes.text();
    const vqd = html.match(/vqd=([a-zA-Z0-9_\-]+)/)?.[1];
    console.log('DDG vqd:', vqd);
    if (vqd) {
      const res = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://duckduckgo.com/',
        }
      });
      const data = await res.json();
      console.log('DDG results count:', data.results?.length);
      if (data.results?.length > 0) {
        console.log('DDG top 3 images:', data.results.slice(0, 3).map(r => ({ title: r.title, image: r.image })));
      }
    }
  } catch (e) {
    console.log('DDG error:', e.message);
  }

  // 2. Bing Images
  try {
    const bRes = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      }
    });
    const bHtml = await bRes.text();
    const murls = [...bHtml.matchAll(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
    console.log('Bing murls count:', murls.length);
    console.log('Bing top 3 images:', murls.slice(0, 3));
  } catch (e) {
    console.log('Bing error:', e.message);
  }

  // 3. Test Google Images via simple scrape
  try {
    const gRes = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const gHtml = await gRes.text();
    const gImgs = [...gHtml.matchAll(/\["(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi)].map(m => m[1]);
    console.log('Google Images count:', gImgs.length);
    console.log('Google top 3 images:', gImgs.slice(0, 3));
  } catch (e) {
    console.log('Google Images error:', e.message);
  }
}

testImageSources();
