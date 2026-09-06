import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

async function testFullPipeline(url: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });

  console.log(`\n========================================\nAnalyzing: ${url}`);
  
  // Grounding + Forensic prompt in one unified fast step
  const prompt = `You are VeriStyle, the advanced universal forensic AI product authenticator.
Analyze this product link: ${url}

Tasks:
1. Search and identify the official product name, brand, platform (Amazon/Flipkart/Myntra/etc), category.
2. Find the exact live current listed price in India (INR ₹) or global market. Use standard ₹XX,XXX format.
3. Find a working high-resolution direct product image URL from the listing or official catalog.
4. Perform an authenticity audit: trustScore (0-100), verdict (VERIFIED AUTHENTIC | SUSPICIOUS REVIEW / RISK | LIKELY COUNTERFEIT), confidence (75-99).
5. All price mentions in xaiReasoning MUST STRICTLY match the exact price.

Return ONLY valid JSON matching this schema:
{
  "itemName": "string",
  "brand": "string",
  "category": "string",
  "platform": "amazon" | "flipkart" | "myntra" | "unknown",
  "exactPrice": "₹...",
  "imageUrl": "https://...",
  "trustScore": number,
  "verdict": "VERIFIED AUTHENTIC" | "SUSPICIOUS REVIEW / RISK" | "LIKELY COUNTERFEIT",
  "aiConfidence": number,
  "priceAnalysis": "Fair Market Price" | "Budget Fast-Fashion Tier" | "Great Value Deal" | "Anomalously Cheap / High Risk" | "Premium Retail Tier",
  "whatBuyersLove": ["string"],
  "whatBuyersDislike": ["string"],
  "hiddenPattern": "string",
  "curiosityTrigger": "string",
  "sentimentBreakdown": { "positive": 80, "neutral": 15, "negative": 5 },
  "detailedScores": {
    "stitchingQuality": 88,
    "typographyAccuracy": 90,
    "fabricTextureMatch": 86,
    "hardwareAuthenticity": 89,
    "serialCodeValidation": 85,
    "reviewPerplexity": 88,
    "reviewSentimentAlignment": 90
  },
  "fakeReviewProbability": number,
  "xaiReasoning": ["string"],
  "recommendations": ["string"]
}`;

  const start = Date.now();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  console.log(`Generated in ${(Date.now() - start) / 1000}s`);
  console.log("Response:", response.text);
}

const testUrls = [
  "https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9",
  "https://www.flipkart.com/xn-xeezos-13-bk-brecelet-led-analog-watch-men/p/itmd69d258f7fd98?pid=WATG3N75YM9JZTPH",
  "https://www.flipkart.com/united-colors-benetton-men-solid-casual-white-shirt/p/itm962625a0aceda?pid=SHTHE84FEBGXKRVM",
  "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU"
];

async function main() {
  for (const u of testUrls) {
    await testFullPipeline(u);
  }
}

main().catch(console.error);
