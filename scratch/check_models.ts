import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function checkModelNames() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey! });

  for (const m of ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]) {
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: "Say OK"
      });
      console.log(`Model [${m}]: SUCCESS ->`, res.text?.trim());
    } catch (e: any) {
      console.log(`Model [${m}]: FAILED ->`, e.message);
    }
  }
}

checkModelNames().catch(console.error);
