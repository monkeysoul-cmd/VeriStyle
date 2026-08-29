const key = Buffer.from('QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=', 'base64').toString('utf-8');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: key });

const models = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.6-flash',
  'gemini-2.5-flash-lite-preview-06-17',
  'gemini-2.5-flash-preview-05-20'
];

async function test() {
  for (const m of models) {
    try {
      const r = await ai.models.generateContent({ model: m, contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }] });
      console.log(m + ': OK - ' + (r.text || '').substring(0, 30));
    } catch (e) {
      console.log(m + ': FAIL - ' + (e.message || '').substring(0, 100));
    }
  }
}
test();
