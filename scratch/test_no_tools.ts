import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testWithoutTools() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
  ];

  for (const m of candidateModels) {
    try {
      console.log(`\n=== Testing ${m} (No Tools) ===`);
      const resp = await ai.models.generateContent({
        model: m,
        contents: "You are VeriStyle product authenticator. What is the retail price and specs of Noise Colorfit Pro 5 Max smartwatch?",
      });
      const text = resp.text || "";
      console.log(`${m} success:`, text.substring(0, 150));
    } catch (e: any) {
      console.log(`${m} error:`, e.message?.substring(0, 150));
    }
  }
}

testWithoutTools();
