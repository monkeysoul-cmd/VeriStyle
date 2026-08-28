const testUrls = [
  {
    name: "Amazon Backpack (Impulse)",
    url: "https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9"
  },
  {
    name: "Amazon Jeans (Kotty)",
    url: "https://www.amazon.in/KOTTY-Regular-Distressed-Fashionable-Trendy/dp/B0DWK2B887"
  },
  {
    name: "Amazon Short Link",
    url: "https://www.amazon.in/dp/B0G2SGV3DW"
  },
  {
    name: "Flipkart Watch (Xeezos)",
    url: "https://www.flipkart.com/xn-xeezos-13-bk-brecelet-led-analog-watch-men/p/itmd69d258f7fd98?pid=WATG3N75YM9JZTPH"
  },
  {
    name: "Flipkart Casual Shirt (Benetton)",
    url: "https://www.flipkart.com/united-colors-benetton-men-solid-casual-white-shirt/p/itm962625a0aceda?pid=SHTHE84FEBGXKRVM"
  },
  {
    name: "Flipkart Mobile (Realme P4x 5G)",
    url: "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU"
  }
];

async function runAllTests() {
  console.log("================================================================================");
  console.log("RUNNING COMPREHENSIVE FLIPKART & AMAZON URL VERIFICATION");
  console.log("================================================================================");

  for (const item of testUrls) {
    console.log(`\nTesting: [${item.name}]`);
    console.log(`URL: ${item.url}`);
    const start = Date.now();
    try {
      const res = await fetch("http://localhost:3000/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.url })
      });
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`HTTP Status: ${res.status} (took ${duration}s)`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  ✓ Item Name:     ${data.itemName}`);
        console.log(`  ✓ Brand:         ${data.brand}`);
        console.log(`  ✓ Platform:      ${data.platform}`);
        console.log(`  ✓ Trust Score:   ${data.trustScore}/100`);
        console.log(`  ✓ Verdict:       ${data.verdict}`);
        console.log(`  ✓ Price:         ${data.extractedPrice || data.estimatedRetailValue}`);
        console.log(`  ✓ Reviews Found: ${data.sampleReviews?.length || 0}`);
        console.log(`  ✓ Image Extracted: ${data.imageUrl ? "YES" : "NO"}`);
      } else {
        const err = await res.json();
        console.log(`  ✗ FAILED:`, err);
      }
    } catch (e: any) {
      console.log(`  ✗ ERROR:`, e.message);
    }
  }
  console.log("\n================================================================================");
  console.log("ALL URL TESTS COMPLETED");
  console.log("================================================================================");
}

runAllTests().catch(console.error);
