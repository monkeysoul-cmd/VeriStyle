import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testUnifiedPrompt(url: string, slugTitle: string, platform: string) {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a real-time web research agent.
Search the web for this product listing:
Product: "${slugTitle}"
Platform: ${platform}
URL: ${url}

Find and return the following factual details:
1. "title": The official, full product name
2. "price": The exact current live selling price in the original currency (e.g. ₹4,499 or $199)
3. "imageUrl": A direct, high-resolution product image URL from the brand or merchant CDN (.jpg, .jpeg, .png, or .webp) — must be the real product photo, NOT a logo/icon
4. "brand": The official brand name
5. "category": The product category
6. "rating": The customer star rating out of 5 (e.g. 4.2)
7. "reviewCount": Total reviews/ratings count (e.g. 1420)
8. "pros": 2-3 genuine product strengths from reviews
9. "cons": 1-2 limitations from reviews

Return ONLY valid JSON matching this schema:
{
  "title": "...",
  "price": "₹...",
  "imageUrl": "https://...",
  "brand": "...",
  "category": "...",
  "rating": 4.2,
  "reviewCount": 1420,
  "pros": ["...", "..."],
  "cons": ["..."]
}`;

  console.log("Running Unified Grounding...");
  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const rawText = resp.text || resp.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("\n") || "";
  console.log("Raw Response:\n", rawText);
}

testUnifiedPrompt(
  "https://www.flipkart.com/noise-colorfit-pro-5-max-1-96-amoled-display-bt-calling-metallic-build-smartwatch/p/itm6e2e2c6b1a3eb",
  "Noise Colorfit Pro 5 Max 1 96 Amoled Display Bt Calling Metallic Build Smartwatch",
  "flipkart"
);
