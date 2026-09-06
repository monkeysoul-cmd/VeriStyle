import fetch from "node-fetch";

async function testImageSources(productTitle: string) {
  console.log("Searching images for:", productTitle);

  // 1. Google Custom Search / Google Images scraping
  try {
    const gUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(productTitle + " white background product")}`;
    const gRes = await fetch(gUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });
    const html = await gRes.text();
    console.log("Google Image search HTML length:", html.length);
    // Extract image URLs from Google Images HTML
    // Google Images embeds full image URLs in script tags like ["https://...", width, height]
    const matches = [...html.matchAll(/(https:\/\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp))/gi)];
    console.log("Google Image matches found:", matches.length);
    const validImages = matches
      .map(m => m[1])
      .filter(u => !u.includes("gstatic.com") && !u.includes("google.com") && !u.includes("logo") && !u.includes("icon"));
    console.log("Filtered real product images from Google:", validImages.slice(0, 5));
  } catch (e) {
    console.error("Google image search error:", e.message);
  }

  // 2. Bing Images scraping
  try {
    const bUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(productTitle + " product")}&form=HDRSC2&first=1`;
    const bRes = await fetch(bUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html",
      }
    });
    const bHtml = await bRes.text();
    console.log("Bing Image search HTML length:", bHtml.length);
    // Bing images JSON embeds m="{murl:&quot;https://...&quot;
    const bMatches = [...bHtml.matchAll(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|jpeg|png|webp))/gi)];
    console.log("Bing direct full-res images found:", bMatches.length);
    console.log("Bing image samples:", bMatches.slice(0, 3).map(m => m[1]));
  } catch (e) {
    console.error("Bing image search error:", e.message);
  }
}

testImageSources("Noise Colorfit Pro 5 Max smartwatch");
