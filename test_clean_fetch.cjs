function cleanUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes('flipkart.com')) {
      const pid = u.searchParams.get('pid');
      const cleanPath = u.pathname;
      return 'https://www.flipkart.com' + cleanPath + (pid ? '?pid=' + pid : '');
    } else if (u.hostname.includes('amazon.')) {
      const asinMatch = rawUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) return 'https://www.amazon.in/dp/' + asinMatch[1];
    }
  } catch(_) {}
  return rawUrl;
}

const urls = [
  'https://www.flipkart.com/mivi-fort-h350-soundbar-350-watts-5-1-channel-multi-input-eq-modes-bt-v5-1-w-bluetooth-soundbar/p/itm38449f86ec63f?pid=ACCH3MUYDSWNP3CS&lid=LSTACCH3MUYDSWNP3CS6ZS3T9&marketplace=FLIPKART&store=0pm&srno=b_1_1&otracker=browse&fm=continuum%2Fhp&iid=e164db6a-db78-4a10-b35c-21f6c5c15d03.ACCH3MUYDSWNP3CS.SEARCH&ppt=browse&ppn=browse&ssid=b88v2akra80000001788022823611&ov_redirect=true&ov_redirect=true',
  'https://www.flipkart.com/lakhya-watch-analog-men/p/itmb63608646dc77?pid=WATHKG4YHSFCGHXN&lid=LSTWATHKG4YHSFCGHXN80VTR9&hl_lid=&marketplace=FLIPKART&fm=eyJ3dHAiOiJwbXVfdjIiLCJwcnB0IjoiaHAiLCJtaWQiOiJjb250aW51dW0vaHAifQ%3D%3D&pageUID=1788022867292',
  'https://www.flipkart.com/moncada-women-flats/p/itmce58091955bfe?pid=SNDH4KWGVCYS79BN&lid=LSTSNDH4KWGVCYS79BNZVNICQ&hl_lid=&marketplace=FLIPKART&fm=eyJ3dHAiOiJwbXVfdjIiLCJwcnB0IjoiaHAiLCJtaWQiOiJjb250aW51dW0vaHAifQ%3D%3D&pageUID=1788022892238'
];

async function run() {
  for (const raw of urls) {
    const c = cleanUrl(raw);
    console.log('\n--- Clean URL:', c);
    const start = Date.now();
    try {
      const res = await fetch('https://r.jina.ai/' + c, { 
        headers: { 'Accept': 'text/plain', 'X-With-Images-Summary': 'true' }, 
        signal: AbortSignal.timeout(6000) 
      });
      const text = await res.text();
      console.log('Time:', Date.now() - start, 'ms');
      console.log('Title match:', text.match(/^Title:\s*(.+)$/m)?.[1]?.substring(0, 70));
      console.log('Price match:', text.match(/(?:₹|Rs\.?)\s*[\d,]+/i)?.[0]);
      const img = [...text.matchAll(/https:\/\/[^\s\)\"\'\]\<\>]+\.(?:jpg|jpeg|png|webp)/gi)].find(m => m[0].includes('rukminim'));
      console.log('Image match:', img?.[0]);
    } catch(e) {
      console.log('Error:', e.message, 'in', Date.now() - start, 'ms');
    }
  }
}
run();
