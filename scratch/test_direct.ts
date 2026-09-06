import fetch from "node-fetch";

async function testFlipkart() {
  const url = "https://www.flipkart.com/noise-colorfit-pro-5-max-1-96-amoled-display-bt-calling-metallic-build-smartwatch/p/itm6e2e2c6b1a3eb";
  
  // 1. Direct fetch with desktop browser headers
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
      }
    });
    const html = await res.text();
    console.log("Direct Flipkart status:", res.status, "HTML length:", html.length);
    // check for price in html
    const priceMatch = html.match(/(?:₹|Rs\.?)\s*[\d,]+/g);
    console.log("Prices found in direct html:", priceMatch?.slice(0, 5));
    // check for images in html
    const imgMatch = html.match(/https:\/\/rukminim\d*\.flixcart\.com\/image\/[^\s"']+/g);
    console.log("Images found in direct html:", imgMatch?.slice(0, 3));
    // check for title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log("Title in direct html:", titleMatch?.[1]);
  } catch (e) {
    console.error("Direct Flipkart error:", e.message);
  }
}

testFlipkart();
