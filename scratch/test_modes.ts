async function testModes() {
  const baseUrl = "http://localhost:3000";

  console.log("=== Testing Review-Only Analysis ===");
  const reviewOnlyRes = await fetch(`${baseUrl}/api/analyze-authenticity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reviewText: "Received this item yesterday. The fabric is 100% polyester instead of silk blend and the care label font has typos. Clearly a first copy replica.",
      brand: "Gucci",
      itemName: "Silk Monogram Scarf"
    })
  });
  const reviewOnlyData: any = await reviewOnlyRes.json();
  console.log("Review-Only Status:", reviewOnlyRes.status);
  console.log("Trust Score:", reviewOnlyData.trustScore);
  console.log("Verdict:", reviewOnlyData.verdict);
  console.log("Image URL (should be empty):", JSON.stringify(reviewOnlyData.imageUrl));
  console.log("Heatmap points count (should be 0):", reviewOnlyData.heatmapPoints?.length);
  console.log("Fake Review / Risk Flags:", reviewOnlyData.reviewFlags);
  console.log("Reasoning:", reviewOnlyData.xaiReasoning);

  console.log("\n=== Testing Image-Only Analysis ===");
  // Simple 1x1 red PNG base64 for testing image pipeline
  const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const imageOnlyRes = await fetch(`${baseUrl}/api/analyze-authenticity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: testImageBase64,
      brand: "Prada",
      itemName: "Re-Nylon Backpack",
      category: "Bags"
    })
  });
  const imageOnlyData: any = await imageOnlyRes.json();
  console.log("Image-Only Status:", imageOnlyRes.status);
  console.log("Trust Score:", imageOnlyData.trustScore);
  console.log("Verdict:", imageOnlyData.verdict);
  console.log("Review Text (should be empty):", JSON.stringify(imageOnlyData.reviewText));
  console.log("Review Flags count (should be 0):", imageOnlyData.reviewFlags?.length);
  console.log("Heatmap points count (should be >0):", imageOnlyData.heatmapPoints?.length);
  console.log("Craftsmanship Scores:", imageOnlyData.detailedScores);
  console.log("\n=== Testing Organic Authentic Review Analysis ===");
  const organicReviewRes = await fetch(`${baseUrl}/api/analyze-authenticity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reviewText: "I have been wearing this jacket for 3 months now. The stitching around the collar and inner lining is immaculate with tight thread gauge. The YKK Excella zippers glide smoothly with heavy metal weight. Great authentic piece.",
      brand: "Acne Studios",
      itemName: "Leather Biker Jacket"
    })
  });
  const organicData: any = await organicReviewRes.json();
  console.log("Organic Review Status:", organicReviewRes.status);
  console.log("Trust Score:", organicData.trustScore);
  console.log("Verdict:", organicData.verdict);
  console.log("Fake Prob:", organicData.fakeReviewProbability);
  console.log("Review Flags:", organicData.reviewFlags);
}

testModes().catch(err => console.error("Test failed:", err));
