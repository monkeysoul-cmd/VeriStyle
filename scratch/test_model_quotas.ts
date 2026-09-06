import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testModels() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const candidateModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];

  for (const m of candidateModels) {
    try {
      console.log(`\n=== Testing ${m} with Grounding ===`);
      const resp = await ai.models.generateContent({
        model: m,
        contents: "What is the price of Noise Colorfit Pro 5 Max smartwatch on Flipkart?",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      const text = resp.text || resp.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("\n") || "";
      console.log(`${m} success (first 200 chars):`, text.substring(0, 200));
    } catch (e: any) {
      console.log(`${m} error:`, e.message?.substring(0, 150));
    }
  }
}

testModels();
