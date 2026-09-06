async function testAmazonAsin() {
  const asins = ['B0CSYYK6B9', 'B08N5WRWNW', 'B0BDK62PDX', 'B07HGH8ML7'];
  for (const asin of asins) {
    const urls = [
      `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX800_.jpg`,
      `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL500_&ID=AsinImage&MarketPlace=IN&ServiceVersion=20070822&WS=1`,
      `https://images.amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
    ];
    for (const u of urls) {
      try {
        const res = await fetch(u, { method: 'HEAD' });
        console.log(`ASIN ${asin} -> ${u} status: ${res.status} content-type: ${res.headers.get('content-type')} content-length: ${res.headers.get('content-length')}`);
      } catch (e) {
        console.log(`ASIN ${asin} error:`, e.message);
      }
    }
  }
}

testAmazonAsin();
