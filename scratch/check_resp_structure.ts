import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function checkResp() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is the price of Noise Colorfit Pro 5 Max smartwatch on Flipkart?",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log("Full resp keys:", Object.keys(resp));
  console.log("Candidates[0]:", JSON.stringify(resp.candidates?.[0], null, 2));
}

checkResp();
