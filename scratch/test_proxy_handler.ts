import handler from "../api/image-proxy";

async function testImageProxy() {
  const testImages = [
    "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/a/u/w/1-c-ldr-07-brn-lakhya-men-original-imahpzafpnsfsfbr.jpeg",
    "https://m.media-amazon.com/images/I/71c8QcK40JL._SL1500_.jpg"
  ];

  for (const img of testImages) {
    console.log("\nTesting proxy for:", img);
    const mockReq: any = {
      method: "GET",
      query: { url: img }
    };
    let statusCode = 0;
    const headers: Record<string, string> = {};
    let sentData: any = null;
    const mockRes: any = {
      setHeader: (k: string, v: string) => { headers[k] = v; },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (j: any) => { sentData = j; },
          send: (d: any) => { sentData = d; },
          end: () => {}
        };
      }
    };

    try {
      await handler(mockReq, mockRes);
      console.log("Status:", statusCode);
      console.log("Headers:", headers);
      console.log("Data length:", sentData?.length || (typeof sentData === "object" ? JSON.stringify(sentData) : sentData));
    } catch (e: any) {
      console.log("Handler threw:", e.message);
    }
  }
}

testImageProxy();
