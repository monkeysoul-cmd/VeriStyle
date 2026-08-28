async function testScraping(url: string) {
  console.log(`Testing URL: ${url}`);
  
  // 1. Direct fetch
  try {
    const res1 = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(4000)
    });
    console.log(`Direct fetch status: ${res1.status}, length: ${(await res1.text()).length}`);
  } catch (e: any) {
    console.log(`Direct fetch error: ${e.message}`);
  }

  // 2. Microlink Open API
  try {
    const mRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=false&meta=true`, {
      signal: AbortSignal.timeout(6000)
    });
    if (mRes.ok) {
      const data: any = await mRes.json();
      console.log(`Microlink result:`, {
        title: data.data?.title,
        image: data.data?.image?.url,
        publisher: data.data?.publisher,
        description: data.data?.description?.substring(0, 100)
      });
    } else {
      console.log(`Microlink status: ${mRes.status}`);
    }
  } catch (e: any) {
    console.log(`Microlink error: ${e.message}`);
  }

  // 3. Jina AI Reader
  try {
    const jRes = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (jRes.ok) {
      const text = await jRes.text();
      console.log(`Jina text snippet (len: ${text.length}):`, text.substring(0, 300));
    } else {
      console.log(`Jina status: ${jRes.status}`);
    }
  } catch (e: any) {
    console.log(`Jina error: ${e.message}`);
  }
}

async function main() {
  await testScraping('https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU');
}

main();
