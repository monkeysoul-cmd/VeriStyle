const { GoogleGenAI } = require('@google/genai');
const cheerio = require('cheerio');

const fallbackKey = Buffer.from(
  'QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=',
  'base64'
).toString('utf-8');
const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
const ai = new GoogleGenAI({ apiKey });

const testUrls = [
  'https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH',
  'https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU',
  'https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9'
];

async function testDirectFetch(url) {
  console.log('\n--- Testing Direct Fetch for:', url);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(6000),
      redirect: 'follow'
    });
    console.log('Direct status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    const $ = cheerio.load(html);
    const title = $('h1').text().trim() || $('title').text().trim();
    console.log('Parsed title:', title.substring(0, 80));

    // Try price selectors
    const prices = [];
    $('div.Nx9bqj, .a-price .a-offscreen, div._30jeq3').each((_, el) => {
      prices.push($(el).text().trim());
    });
    console.log('Parsed prices:', prices.slice(0, 3));

    // Try image selectors
    const images = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('rukminim') || src.includes('media-amazon'))) {
        images.push(src);
      }
    });
    console.log('Parsed images:', images.slice(0, 3));
  } catch (err) {
    console.log('Direct fetch failed:', err.message);
  }
}

async function testGeminiSearch(url) {
  console.log('\n--- Testing Gemini with Google Search for:', url);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the exact live price, exact official product name, brand, and main product image URL for this e-commerce product link: ${url}.
Return JSON with { "title": "...", "brand": "...", "price": "...", "imageUrl": "..." }`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    console.log('Gemini Search response text:');
    console.log(response.text);
  } catch (err) {
    console.log('Gemini search failed:', err.message);
  }
}

async function main() {
  for (const url of testUrls) {
    await testDirectFetch(url);
    await testGeminiSearch(url);
  }
}

main();
