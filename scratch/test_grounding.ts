import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function testGrounding() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const url = "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze this live Flipkart product URL: ${url}
Extract:
1. Exact Official Product Name
2. Brand
3. Current Retail Price in INR (e.g. ₹24,999)
4. Verified Product Image URL (high-res image from Flipkart or official brand site)
5. Authenticity / Trust Score (0-100)
6. Summary of buyer sentiment and craftsmanship

Respond in JSON format:
{
  "itemName": string,
  "brand": string,
  "price": string,
  "imageUrl": string,
  "trustScore": number,
  "verdict": string,
  "whatBuyersLove": string[],
  "whatBuyersDislike": string[]
}`,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  console.log("Gemini Response:", response.text);
}

testGrounding().catch(console.error);
