const { GoogleGenAI } = require('@google/genai');

const fallbackKey = Buffer.from(
  'QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=',
  'base64'
).toString('utf-8');
const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
const ai = new GoogleGenAI({ apiKey });

function sanitizeProductUrl(rawUrl) {
  let u = rawUrl.trim();
  if (u.includes('veristyle.ai/')) {
    u = u.split('veristyle.ai/')[1].trim();
  }
  if (!u.startsWith('http')) {
    u = 'https://' + u;
  }
  try {
    const urlObj = new URL(u);
    if (urlObj.hostname.includes('flipkart.com')) {
      let cleanPath = urlObj.pathname;
      if (cleanPath.includes('/product-reviews/')) {
        cleanPath = cleanPath.replace('/product-reviews/', '/p/');
      }
      const pid = urlObj.searchParams.get('pid');
      return `https://www.flipkart.com${cleanPath}${pid ? '?pid=' + pid : ''}`;
    } else if (urlObj.hostname.includes('amazon.')) {
      const asinMatch = u.match(/\/(?:dp|gp\/product|product-reviews)\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        return `https://${urlObj.hostname}/dp/${asinMatch[1].toUpperCase()}`;
      }
      return `https://${urlObj.hostname}${urlObj.pathname}`;
    } else if (urlObj.hostname.includes('myntra.com')) {
      return `https://www.myntra.com${urlObj.pathname}`;
    }
  } catch (_) {}
  return u;
}

function extractMetadataFromUrl(url) {
  let platform = 'retailer';
  if (url.includes('amazon.')) platform = 'amazon';
  else if (url.includes('flipkart.com')) platform = 'flipkart';
  else if (url.includes('myntra.com')) platform = 'myntra';
  else if (url.includes('ajio.com')) platform = 'ajio';
  else if (url.includes('meesho.com')) platform = 'meesho';
  else if (url.includes('nykaa.com')) platform = 'nykaa';

  let slugTitle = '';
  let asin = '';
  let brandHint = '';

  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(Boolean);

    if (platform === 'amazon') {
      const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) asin = asinMatch[1].toUpperCase();
      if (segments.length > 0 && !segments[0].match(/^(dp|gp|ref)$/i)) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, ' ');
      }
    } else if (platform === 'flipkart') {
      if (segments.length > 0) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, ' ');
      }
    } else if (platform === 'myntra') {
      // Myntra URL pattern: /category/brand/product-name/id/buy
      const meaningfulSegments = segments.filter(s => !['buy', 'pdp', 'item'].includes(s.toLowerCase()) && !/^\d+$/.test(s));
      if (meaningfulSegments.length >= 2) {
        brandHint = decodeURIComponent(meaningfulSegments[meaningfulSegments.length - 2]).replace(/[-_+]/g, ' ');
        slugTitle = decodeURIComponent(meaningfulSegments[meaningfulSegments.length - 1]).replace(/[-_+]/g, ' ');
      } else if (meaningfulSegments.length === 1) {
        slugTitle = decodeURIComponent(meaningfulSegments[0]).replace(/[-_+]/g, ' ');
      }
    } else if (segments.length > 0) {
      const meaningful = segments.filter(s => !['buy', 'p', 'item', 'product'].includes(s.toLowerCase()) && !/^\d+$/.test(s));
      slugTitle = decodeURIComponent(meaningful[meaningful.length - 1] || segments[0]).replace(/[-_+]/g, ' ');
    }
  } catch (_) {}

  const cleanTitle = slugTitle
    .replace(/[^\w\s\.\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return { platform, slugTitle: cleanTitle, asin, brandHint };
}

function normalizePrice(rawPrice) {
  if (!rawPrice) return '';
  const clean = rawPrice.replace(/\s+/g, '').replace(/INR|Rs\.?/gi, '₹');
  const match = clean.match(/([₹$€£])?([\d,]+(?:\.\d{2})?)/);
  if (!match) return '';
  const sym = match[1] || '₹';
  const numPart = match[2];
  const num = parseFloat(numPart.replace(/,/g, ''));
  if (isNaN(num) || num <= 10) return '';
  // Format with standard commas if missing
  const formattedNum = num.toLocaleString('en-IN');
  return `${sym}${formattedNum}`;
}

function extractBestPrice(text) {
  if (!text) return '';
  // 1. Look for explicit price statements
  const strongMatches = [
    ...text.matchAll(/(?:special price|deal price|our price|selling price|price:?|pay:?|MRP:?|Rs\.?|₹)\s*[:=]?\s*(?:₹|Rs\.?|INR|\$|€|£)?\s*([\d,]+(?:\.\d{2})?)/gi)
  ];
  for (const m of strongMatches) {
    const p = normalizePrice(m[0]);
    if (p) return p;
  }
  // 2. Generic price matches (ignoring tiny values like delivery fee)
  const allMatches = [...text.matchAll(/(?:₹|Rs\.?|INR|\$|€|£)\s*([\d,]+(?:\.\d{2})?)/gi)];
  for (const m of allMatches) {
    const p = normalizePrice(m[0]);
    if (p) return p;
  }
  return '';
}

function isValidProductImage(url) {
  if (!url || !url.startsWith('http')) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg') || lower.includes('.svg?') || lower.includes('/svg/')) return false;
  const bad = ['logo', 'icon', 'banner', 'button', 'badge', 'avatar', 'sprite', 'batman', 'loading', 'placeholder', 'header', 'footer', 'nav', 'menu', 'x-locale', 'favicon', '1x1'];
  if (bad.some(k => lower.includes(k))) return false;
  return /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url) || /media-amazon\.com|flixcart\.com|myntassets\.com|ajio\.com/i.test(url);
}

function upgradeImageUrl(url) {
  if (!url) return '';
  let upgraded = url;
  if (upgraded.includes('rukminim') && upgraded.includes('flixcart.com')) {
    upgraded = upgraded.replace(/\/image\/\d+\/\d+\//, '/image/832/832/').replace(/^http:\/\//, 'https://');
  } else if (upgraded.includes('amazon.com') || upgraded.includes('media-amazon.com')) {
    upgraded = upgraded.replace(/\._[A-Z0-9_,]+_\./, '._SL1500_.');
  }
  return upgraded;
}

// Scraper A: Microlink API
async function scrapeViaMicrolink(cleanUrl) {
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&meta=true`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const json = await res.json();
      const d = json?.data;
      if (d) {
        const title = (d.title || '').replace(/\s*(\||\:|\-)\s*(Reviews.*|Buy.*|Price in India.*|Flipkart\.com.*|Amazon\..*|Online.*|Official Store.*)$/i, '').trim();
        const price = extractBestPrice(d.description || '') || extractBestPrice(d.title || '');
        let imageUrl = d.image?.url || '';
        if (imageUrl && isValidProductImage(imageUrl)) {
          imageUrl = upgradeImageUrl(imageUrl);
        } else {
          imageUrl = '';
        }
        return { title, price, imageUrl, description: d.description || '' };
      }
    }
  } catch (_) {}
  return { title: '', price: '', imageUrl: '', description: '' };
}

// Scraper B: Jina AI Web Reader
async function scrapeViaJina(cleanUrl) {
  try {
    const res = await fetch(`https://r.jina.ai/${cleanUrl}`, {
      headers: { 'Accept': 'text/plain', 'X-With-Images-Summary': 'true', 'X-No-Cache': 'true' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const text = await res.text();
      const titleMatch = text.match(/^Title:\s*(.+)$/m);
      let title = titleMatch ? titleMatch[1].replace(/\s*(\||\:|\-)\s*(Reviews.*|Buy.*|Price in India.*|Flipkart\.com.*|Amazon\..*|Online.*)$/i, '').trim() : '';
      const price = extractBestPrice(text);
      let imageUrl = '';
      const imgMatches = [...text.matchAll(/https:\/\/[^\s\)\"\'\\<\\>]+\.(?:jpg|jpeg|png|webp|avif)/gi)];
      for (const m of imgMatches) {
        if (isValidProductImage(m[0])) {
          imageUrl = upgradeImageUrl(m[0]);
          break;
        }
      }
      return { title, price, imageUrl, description: text.substring(0, 1500) };
    }
  } catch (_) {}
  return { title: '', price: '', imageUrl: '', description: '' };
}

// Search C: DuckDuckGo + Bing Image Discovery
async function searchProductImage(query, platform) {
  const searchQuery = `${query} ${platform}`.trim();
  if (searchQuery.length < 4) return '';

  // 1. DuckDuckGo Image Search
  try {
    const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(4000)
    });
    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=([a-zA-Z0-9_\-]+)/);
    if (vqdMatch) {
      const imgRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(searchQuery)}&vqd=${vqdMatch[1]}&f=,,,&p=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://duckduckgo.com/'
        },
        signal: AbortSignal.timeout(4000)
      });
      const imgData = await imgRes.json();
      if (imgData.results && imgData.results.length > 0) {
        // Look for official retailer CDN first
        const cdnMatch = imgData.results.find(r => r.image && isValidProductImage(r.image) && (r.image.includes('flixcart.com') || r.image.includes('media-amazon.com') || r.image.includes('myntassets.com') || r.image.includes('ajio.com')));
        if (cdnMatch) return upgradeImageUrl(cdnMatch.image);
        // Otherwise take first valid product image
        for (const r of imgData.results) {
          if (r.image && isValidProductImage(r.image)) {
            return upgradeImageUrl(r.image);
          }
        }
      }
    }
  } catch (_) {}

  // 2. Bing Image Search Fallback
  try {
    const bUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}&form=HDRSC2&first=1`;
    const bRes = await fetch(bUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(4000)
    });
    if (bRes.ok) {
      const bHtml = await bRes.text();
      const bMatches = [...bHtml.matchAll(/murl&quot;:&quot;(https:\/\/[^&"]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
      const cdnMatch = bMatches.find(u => isValidProductImage(u) && (u.includes('flixcart.com') || u.includes('media-amazon.com') || u.includes('myntassets.com')));
      if (cdnMatch) return upgradeImageUrl(cdnMatch);
      for (const m of bMatches) {
        if (isValidProductImage(m)) return upgradeImageUrl(m);
      }
    }
  } catch (_) {}

  return '';
}

async function testPipeline(url) {
  console.log(`\n======================================================\nAnalyzing URL: ${url}`);
  const cleanUrl = sanitizeProductUrl(url);
  const { platform, slugTitle, asin, brandHint } = extractMetadataFromUrl(cleanUrl);
  console.log('Metadata:', { platform, slugTitle, asin, brandHint });

  const [microData, jinaData] = await Promise.all([
    scrapeViaMicrolink(cleanUrl),
    scrapeViaJina(cleanUrl)
  ]);

  console.log('Microlink scraped:', { title: microData.title?.substring(0, 50), price: microData.price, image: microData.imageUrl?.substring(0, 60) });
  console.log('Jina scraped:', { title: jinaData.title?.substring(0, 50), price: jinaData.price, image: jinaData.imageUrl?.substring(0, 60) });

  const resolvedTitle = microData.title || jinaData.title || slugTitle || 'E-Commerce Product';
  let resolvedPrice = microData.price || jinaData.price || '';

  // Image resolution priority:
  let resolvedImage = '';
  if (microData.imageUrl && isValidProductImage(microData.imageUrl)) {
    resolvedImage = microData.imageUrl;
  } else if (jinaData.imageUrl && isValidProductImage(jinaData.imageUrl)) {
    resolvedImage = jinaData.imageUrl;
  }

  if (!resolvedImage) {
    const query = resolvedTitle !== 'E-Commerce Product' ? resolvedTitle : slugTitle;
    resolvedImage = await searchProductImage(query, platform);
  }

  console.log('FINAL RESOLVED:');
  console.log('  Title:', resolvedTitle);
  console.log('  Price:', resolvedPrice || '(will be estimated by Gemini)');
  console.log('  Image:', resolvedImage);
}

const testUrls = [
  'https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9',
  'https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH',
  'https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU',
  'https://www.flipkart.com/mivi-fort-h350-soundbar-350-watts-5-1-channel-multi-input-eq-modes-bt-v5-1-w-bluetooth-soundbar/p/itm38449f86ec63f',
  'https://www.myntra.com/shirts/roadster/roadster-men-navy-blue-regular-fit-solid-casual-shirt/9713949/buy'
];

async function runAll() {
  for (const u of testUrls) {
    await testPipeline(u);
  }
}

runAll();
