import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const url = "https://www.flipkart.com/noise-colorfit-pro-5-max-1-96-amoled-display-bt-calling-metallic-build-smartwatch/p/itm6e2e2c6b1a3eb";

  console.log("Testing Google Grounding with Gemini 2.5 Flash...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Search for product "Noise Colorfit Pro 5 Max" on Flipkart India.
Find:
1. Current listed price (e.g. ₹4,499)
2. Product image URL from flixcart CDN (rukminim1.flixcart.com or rukminim2.flixcart.com)
3. Customer rating
4. Brand

Return ONLY JSON:
{"title": "Noise Colorfit Pro 5 Max...", "price": "₹...", "imageUrl": "https://...", "rating": 4.2, "brand": "Noise"}`
            }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    console.log("Candidates parts:", JSON.stringify(response.candidates?.[0]?.content?.parts, null, 2));
    console.log("Response text:", response.text);
  } catch (err) {
    console.error("Grounding error:", err);
  }
}

run();
