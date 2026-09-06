import { runUniversalGeminiForensics } from "../api/analyze-url";

const testUrls = [
  {
    name: "Amazon Backpack",
    url: "https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9",
  },
  {
    name: "Flipkart Lakhya Watch",
    url: "https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH",
  },
  {
    name: "Flipkart Realme Phone",
    url: "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU",
  },
];

async function runTests() {
  console.log("Starting comprehensive pipeline verification...\n");

  for (const item of testUrls) {
    console.log(`================================================================`);
    console.log(`TESTING: ${item.name}`);
    console.log(`URL: ${item.url}`);
    const t0 = Date.now();

    try {
      const result = await runUniversalGeminiForensics(item.url);
      const elapsed = Date.now() - t0;

      console.log(`Completed in: ${elapsed}ms`);
      console.log(`Item Name:           ${result.itemName}`);
      console.log(`Brand:               ${result.brand}`);
      console.log(`Category:            ${result.category}`);
      console.log(`Live Price:          ${result.extractedPrice}`);
      console.log(`Estimated Retail:    ${result.estimatedRetailValue}`);
      console.log(`Image URL:           ${result.imageUrl}`);
      console.log(`Trust Score:         ${result.trustScore}`);
      console.log(`Verdict:             ${result.verdict}`);
      console.log(`Price Consistency:   ${result.extractedPrice === result.estimatedRetailValue ? "PASS (100% Match)" : "FAIL"}`);
      console.log(`HTTPS Check:         ${result.imageUrl?.startsWith("https://") ? "PASS" : "FAIL"}`);
      console.log(`Image Valid:         ${!result.imageUrl?.includes("photo-1523275335684-37898b6baf30") ? "PASS (Genuine Product Media)" : "WARN (Fallback)"}`);
      console.log(`Reasoning snippet:   ${result.xaiReasoning?.[0]}`);
      console.log();
    } catch (err: any) {
      console.error(`FAILED for ${item.name}:`, err.message);
    }
  }
}

runTests();
