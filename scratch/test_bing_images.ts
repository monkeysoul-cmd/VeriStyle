async function searchBingProductImage(query: string): Promise<string> {
  if (!query || query.length < 3) return "";
  try {
    const bUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query + " product white background")}&form=HDRSC2&first=1`;
    const bRes = await fetch(bUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(5000)
    });
    if (bRes.ok) {
      const bHtml = await bRes.text();
      const bMatches = [...bHtml.matchAll(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|jpeg|png|webp))/gi)];
      for (const m of bMatches) {
        const src = m[1];
        const lower = src.toLowerCase();
        if (
          !lower.includes("logo") &&
          !lower.includes("icon") &&
          !lower.includes("avatar") &&
          !lower.includes("banner") &&
          !lower.includes("sprite")
        ) {
          return src;
        }
      }
    }
  } catch (e: any) {
    console.warn("Bing search failed:", e.message);
  }
  return "";
}

async function testAll() {
  const queries = [
    "Noise Colorfit Pro 5 Max smartwatch",
    "boAt Airdopes 141 earbuds",
    "Nike Air Jordan 1 Retro High OG",
    "Chanel Classic Flap Bag Black Caviar"
  ];
  for (const q of queries) {
    const img = await searchBingProductImage(q);
    console.log(`[${q}] => ${img}`);
  }
}

testAll();
