import dotenv from "dotenv";
dotenv.config();
import { sanitizeProductUrl } from "../api/analyze-url";

const testUrls = [
  "https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9",
  "https://www.flipkart.com/xn-xeezos-13-bk-brecelet-led-analog-watch-men/p/itmd69d258f7fd98?pid=WATG3N75YM9JZTPH",
  "https://www.flipkart.com/united-colors-benetton-men-solid-casual-white-shirt/p/itm962625a0aceda?pid=SHTHE84FEBGXKRVM",
  "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU",
  "https://www.myntra.com/shirts/roadster/roadster-men-casual-shirt/12345/buy"
];

async function testScraping(rawUrl: string) {
  const cleanUrl = sanitizeProductUrl(rawUrl);
  console.log(`\n========================================\nTesting URL: ${cleanUrl}`);
  
  // 1. Test Jina
  try {
    const start = Date.now();
    const res = await fetch(`https://r.jina.ai/${cleanUrl}`, {
      headers: { Accept: "text/plain", "X-With-Images-Summary": "true" },
      signal: AbortSignal.timeout(6000),
    });
    console.log(`Jina status: ${res.status} (${Date.now() - start}ms)`);
    if (res.ok) {
      const text = await res.text();
      console.log("Jina first 400 chars:\n", text.substring(0, 400));
      
      const priceMatches = [...text.matchAll(/(?:₹|Rs\.?|INR|\$|€|£|¥)\s*[\d,]+(?:\.\d{2})?/gi)];
      console.log("Jina Price Matches:", priceMatches.map(m => m[0]));
      
      const imgMatches = [...text.matchAll(/https:\/\/[^\s\)\"\'\]\<\>]+\.(?:jpg|jpeg|png|webp|avif)/gi)];
      console.log("Jina Image Matches:", imgMatches.slice(0, 5).map(m => m[0]));
    }
  } catch (e: any) {
    console.log("Jina error:", e.message);
  }

  // 2. Test Microlink
  try {
    const start = Date.now();
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}`, {
      signal: AbortSignal.timeout(5000)
    });
    console.log(`Microlink status: ${res.status} (${Date.now() - start}ms)`);
    if (res.ok) {
      const data = await res.json();
      console.log("Microlink data:", {
        title: data?.data?.title,
        image: data?.data?.image?.url,
        description: data?.data?.description
      });
    }
  } catch (e: any) {
    console.log("Microlink error:", e.message);
  }
}

async function main() {
  for (const u of testUrls) {
    await testScraping(u);
  }
}

main();
