const { GoogleGenAI } = require('@google/genai');

const fallbackKey = Buffer.from(
  'QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=',
  'base64'
).toString('utf-8');
const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
const ai = new GoogleGenAI({ apiKey });

async function testGrounding(model) {
  console.log(`\n--- Testing Search Grounding on ${model} ---`);
  try {
    const t0 = Date.now();
    const res = await ai.models.generateContent({
      model: model,
      contents: 'Search Google for the product "realme p4x 5g" on Flipkart India. What is its current price in Indian Rupees (INR)? Answer with just the price.',
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    console.log(`Success in ${Date.now() - t0}ms:`, res.text.trim());
    if (res.candidates?.[0]?.groundingMetadata) {
      console.log('Grounding metadata search queries:', res.candidates[0].groundingMetadata.webSearchQueries);
      console.log('Grounding metadata chunks:', res.candidates[0].groundingMetadata.groundingChunks?.slice(0, 3));
    }
  } catch (e) {
    console.log(`Failed on ${model}:`, e.message);
  }
}

async function run() {
  await testGrounding('gemini-3.5-flash');
  await testGrounding('gemini-2.5-flash');
}

run();
