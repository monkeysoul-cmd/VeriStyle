import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testFixedGrounding() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const query = "What is the live listed price, official product name, customer rating, and brand for Noise Colorfit Pro 5 Max smartwatch on Flipkart India?";

  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log("Candidate 0 full:", JSON.stringify(resp.candidates?.[0], null, 2));
}

testFixedGrounding();
