const { GoogleGenAI } = require('@google/genai');

const fallbackKey = Buffer.from(
  'QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=',
  'base64'
).toString('utf-8');
const apiKey = process.env.GEMINI_API_KEY || fallbackKey;
const ai = new GoogleGenAI({ apiKey });

const products = [
  { title: 'realme P4x 5G (Matte Silver, 128 GB)', brand: 'realme', category: 'Smartphones' },
  { title: 'Mivi Fort H350 Soundbar 350 Watts 5.1 Channel', brand: 'Mivi', category: 'Audio / Soundbars' },
  { title: 'XN XEEZOS 13 bk brecelet led Analog Watch For Men', brand: 'XN XEEZOS', category: 'Watches' },
  { title: 'Impulse EmpowerElite 25L Water Resistant Laptop Backpack Black', brand: 'Impulse', category: 'Bags & Backpacks' },
  { title: 'Roadster Men Navy Blue Regular Fit Solid Casual Shirt', brand: 'Roadster', category: 'Apparel' }
];

async function testPricing() {
  for (const p of products) {
    const prompt = `You are an expert Indian e-commerce marketplace analyst.
What is the realistic current selling price in Indian Rupees (INR ₹) on Flipkart/Amazon India for this product:
Product: "${p.title}"
Brand: "${p.brand}"
Category: "${p.category}"

Instructions:
- Return ONLY the exact price string, like "₹649", "₹299", "₹7,999", "₹14,999".
- Be accurate to typical Indian e-commerce discounting (e.g. entry-level budget watches are ₹200-₹399, fast-fashion shirts are ₹499-₹799, budget 25L backpacks are ₹599-₹999, 350W soundbars are ₹7,999-₹9,999, mid-range 5G phones are ₹11,999-₹15,999).
- Do NOT output explanations or ranges, just the single best estimated price.`;

    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt
      });
      console.log(`${p.title} -> [${res.text.trim()}]`);
    } catch (e) {
      console.log(`Failed for ${p.title}:`, e.message);
    }
  }
}

testPricing();
