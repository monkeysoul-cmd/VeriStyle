async function testDuckDuckGoImages(query: string) {
  try {
    // 1. Get token
    const tokenUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    const tokenRes = await fetch(tokenUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      }
    });
    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=([a-zA-Z0-9_\-]+)/);
    console.log("VQD match:", vqdMatch?.[1]);
    
    if (vqdMatch) {
      const imgApi = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqdMatch[1]}&f=,,,&p=1`;
      const imgRes = await fetch(imgApi, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://duckduckgo.com/",
        }
      });
      const imgData = await imgRes.json();
      console.log("DuckDuckGo image results count:", imgData.results?.length);
      console.log("First 3 image URLs:", imgData.results?.slice(0, 3).map((r: any) => r.image));
    }
  } catch (e: any) {
    console.error("DDG image error:", e.message);
  }
}

testDuckDuckGoImages("Noise Colorfit Pro 5 Max smartwatch");
