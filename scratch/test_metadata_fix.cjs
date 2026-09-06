function isErrorTitle(title) {
  if (!title) return true;
  const lower = title.toLowerCase();
  return (
    lower.includes('site maintenance') ||
    lower.includes('page not found') ||
    lower.includes('access denied') ||
    lower.includes('robot check') ||
    lower.includes('something went wrong') ||
    lower.includes('are you a human') ||
    lower.includes('404 not found') ||
    lower.includes('buy products online') ||
    title.length < 3
  );
}

function extractMetadataFromRawUrl(rawUrl) {
  let platform = 'retailer';
  if (rawUrl.includes('amazon.')) platform = 'amazon';
  else if (rawUrl.includes('flipkart.com')) platform = 'flipkart';
  else if (rawUrl.includes('myntra.com')) platform = 'myntra';
  else if (rawUrl.includes('ajio.com')) platform = 'ajio';
  else if (rawUrl.includes('meesho.com')) platform = 'meesho';
  else if (rawUrl.includes('nykaa.com')) platform = 'nykaa';

  let slugTitle = '';
  let asin = '';
  let brandHint = '';

  try {
    let clean = rawUrl.trim();
    if (clean.includes('veristyle.ai/')) clean = clean.split('veristyle.ai/')[1].trim();
    if (!clean.startsWith('http')) clean = 'https://' + clean;

    const urlObj = new URL(clean);
    const segments = urlObj.pathname.split('/').filter(Boolean);

    if (platform === 'amazon') {
      const asinMatch = clean.match(/\/(?:dp|gp\/product|product-reviews)\/([A-Z0-9]{10})/i);
      if (asinMatch) asin = asinMatch[1].toUpperCase();
      // Look for the product name segment
      const slugSegment = segments.find(s => !['dp', 'gp', 'product', 'ref', 'product-reviews'].includes(s.toLowerCase()) && !/^[A-Z0-9]{10}$/i.test(s));
      if (slugSegment) {
        slugTitle = decodeURIComponent(slugSegment).replace(/[-_+]/g, ' ');
      }
    } else if (platform === 'flipkart') {
      if (segments.length > 0) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, ' ');
      }
    } else if (platform === 'myntra') {
      const meaningful = segments.filter(s => !['buy', 'pdp', 'item'].includes(s.toLowerCase()) && !/^\d+$/.test(s));
      if (meaningful.length >= 2) {
        brandHint = decodeURIComponent(meaningful[meaningful.length - 2]).replace(/[-_+]/g, ' ');
        slugTitle = decodeURIComponent(meaningful[meaningful.length - 1]).replace(/[-_+]/g, ' ');
      } else if (meaningful.length === 1) {
        slugTitle = decodeURIComponent(meaningful[0]).replace(/[-_+]/g, ' ');
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

console.log('Amazon Backpack:', extractMetadataFromRawUrl('https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9'));
console.log('Amazon DP only:', extractMetadataFromRawUrl('https://www.amazon.in/dp/B0CSYYK6B9'));
console.log('Flipkart Watch:', extractMetadataFromRawUrl('https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH'));
console.log('Myntra Shirt:', extractMetadataFromRawUrl('https://www.myntra.com/shirts/roadster/roadster-men-navy-blue-regular-fit-solid-casual-shirt/9713949/buy'));
console.log('Is "Site Maintenance" error title:', isErrorTitle('Site Maintenance'));
