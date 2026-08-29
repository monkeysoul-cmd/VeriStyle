const key = Buffer.from('QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=', 'base64').toString('utf-8');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: key });

async function test() {
  // Test 1: The format used in _analyzer.ts right now
  console.log('=== TEST 1: contents: [{ text }] format ===');
  try {
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: 'Say OK' }],
      config: { temperature: 0.1 }
    });
    console.log('OK - text type:', typeof r.text, '| value:', String(r.text).substring(0, 50));
  } catch(e) {
    console.log('FAIL:', String(e.message).substring(0, 200));
  }

  // Test 2: The correct role/parts format
  console.log('=== TEST 2: contents: [{ role, parts }] format ===');
  try {
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
      config: { temperature: 0.1 }
    });
    console.log('OK - text type:', typeof r.text, '| value:', String(r.text).substring(0, 50));
  } catch(e) {
    console.log('FAIL:', String(e.message).substring(0, 200));
  }

  // Test 3: With responseMimeType application/json
  console.log('=== TEST 3: with responseMimeType JSON ===');
  try {
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Return ONLY JSON: {"ok": true, "score": 85}' }] }],
      config: { responseMimeType: 'application/json', temperature: 0.1 }
    });
    console.log('OK - text:', String(r.text).substring(0, 100));
  } catch(e) {
    console.log('FAIL:', String(e.message).substring(0, 200));
  }
}
test().catch(e => console.error('UNHANDLED:', e.message));
