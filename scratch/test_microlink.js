async function test() {
  const url = 'https://www.flipkart.com/triggr-horizon-16-dual-drivers-7hrs-playtime-mems-mic-tws-function-16-w-bluetooth-speaker/p/itm53bb1825bcf6a';
  
  try {
    const mRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true`);
    const data = await mRes.json();
    console.log('Microlink Status:', data.status);
    console.log('Title:', data.data?.title);
    console.log('Image:', data.data?.image?.url);
    console.log('Description:', data.data?.description);
    console.log('Publisher:', data.data?.publisher);
  } catch (e) {
    console.error('Microlink error:', e);
  }
}

test();
