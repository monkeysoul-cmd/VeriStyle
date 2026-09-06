async function testMicrolink(url) {
  console.log('\n--- Testing Microlink for:', url);
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=false&meta=true`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(8000)
    });
    console.log('Microlink status:', res.status);
    if (res.ok) {
      const json = await res.json();
      console.log('Microlink data:', {
        status: json.status,
        title: json.data?.title,
        description: json.data?.description,
        image: json.data?.image,
        author: json.data?.author,
        publisher: json.data?.publisher,
      });
    } else {
      const err = await res.text();
      console.log('Microlink failed:', err.substring(0, 100));
    }
  } catch (e) {
    console.log('Microlink error:', e.message);
  }
}

async function run() {
  await testMicrolink('https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH');
  await testMicrolink('https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9');
  await testMicrolink('https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU');
}

run();
