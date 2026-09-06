const handler = require('../api/image-proxy').default;

async function testImageProxy() {
  const testImages = [
    'https://rukminim2.flixcart.com/image/832/832/xif0q/watch/a/u/w/1-c-ldr-07-brn-lakhya-men-original-imahpzafpnsfsfbr.jpeg',
    'https://m.media-amazon.com/images/I/71c8QcK40JL._SL1500_.jpg'
  ];

  for (const img of testImages) {
    console.log('\nTesting proxy for:', img);
    const mockReq = {
      method: 'GET',
      query: { url: img }
    };
    let statusCode = 0;
    let headers = {};
    let sentData = null;
    const mockRes = {
      setHeader: (k, v) => { headers[k] = v; },
      status: (code) => {
        statusCode = code;
        return {
          json: (j) => { sentData = j; },
          send: (d) => { sentData = d; },
          end: () => {}
        };
      }
    };

    try {
      await handler(mockReq, mockRes);
      console.log('Status:', statusCode);
      console.log('Headers:', headers);
      console.log('Data length:', sentData?.length || (typeof sentData === 'object' ? JSON.stringify(sentData) : sentData));
    } catch (e) {
      console.log('Handler threw:', e.message);
    }
  }
}

testImageProxy();
