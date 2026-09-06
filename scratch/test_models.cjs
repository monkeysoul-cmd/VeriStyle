const { GoogleGenAI } = require('@google/genai');

const fallbackKey = Buffer.from(
  'QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=',
  'base64'
).toString('utf-8');
const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
const ai = new GoogleGenAI({ apiKey });

const models = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

async function check() {
  for (const m of models) {
    try {
      const t0 = Date.now();
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Return JSON: {"ok": true}',
      });
      console.log(`Model ${m}: OK in ${Date.now() - t0}ms -> ${res.text.trim().substring(0, 40)}`);
    } catch (e) {
      console.log(`Model ${m}: FAILED -> ${e.message.substring(0, 100)}`);
    }
  }
}

check();
