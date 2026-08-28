async function testRealme() {
  const url = "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU&lid=LSTMOBHN7A8HYC9BPAUEQNPRK&marketplace=FLIPKART&store=tyy%2F4io&srno=b_1_1&otracker=browse&fm=organic&iid=en_FPPuLfquDxVIECtn_zXUBXI60lY0jBE23lt3tQoHQhfVOR3DcJZn-KiMRWIpcLMZn9aRBde1e9GFbQL-qruqqv-DHS2p77kVSbtUO55UNHs3cCSHegTsNfH_QPjs3Sl0&ppt=None&ppn=None&ssid=076pxgsl340000001787679642852&ov_redirect=true";

  console.log("Testing analyze-url with user's exact Realme link...");
  const res = await fetch("http://localhost:3000/api/analyze-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Result Item Name:", data.itemName);
  console.log("Result Brand:", data.brand);
  console.log("Result Trust Score:", data.trustScore);
  console.log("Result Verdict:", data.verdict);
  console.log("Result Price:", data.extractedPrice);
  console.log("Result Image URL:", data.imageUrl);
  console.log("Result Error (if any):", data.error, data.message);
}

testRealme().catch(console.error);
