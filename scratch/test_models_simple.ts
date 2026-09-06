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

  // Test models with prompt
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  for (const m of models) {
    try {
      console.log(`\n=== Testing ${m} without tools ===`);
      const resp = await ai.models.generateContent({
        model: m,
        contents: "What is the price and specs of Noise Colorfit Pro 5 Max smartwatch on Flipkart in India?",
      });
      console.log(`${m} response (first 200 chars):`, resp.text?.substring(0, 200));
    } catch (e) {
      console.log(`${m} failed:`, e.message);
    }
  }
}

run();
