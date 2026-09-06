import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testGeminiImage() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find the exact official direct CDN product image URL (must end in .jpg, .jpeg, .png, or .webp) for 'Noise Colorfit Pro 5 Max smartwatch'. Return ONLY the image URL.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const text = resp.text || resp.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("\n") || "";
  console.log("Gemini image response:", text);
}

testGeminiImage();
