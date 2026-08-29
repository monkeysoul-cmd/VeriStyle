const { GoogleGenAI } = require('@google/genai');

const key = Buffer.from('QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=', 'base64').toString('utf-8');
const ai = new GoogleGenAI({ apiKey: key });

function cleanJsonResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  return cleaned.trim();
}

async function test() {
  const url = 'https://www.flipkart.com/lakhya-watch-analog-men/p/itm3dfa3a209ee7e?pid=WATHPZAFXGANS5HH';
  const platform = 'flipkart';
  const productName = 'Lakhya Watch Analog Men';
  const brand = 'Lakhya';

  const prompt = `You are VeriStyle, an expert forensic AI authenticator for e-commerce products.

Analyze this product URL and generate a complete authenticity report.

URL: ${url}
Platform: ${platform}
Product Name from URL: ${productName}
Brand: ${brand}

Based on the URL slug, product name, brand, and your knowledge of this product category and marketplace:
1. Identify the exact product (watch, phone, speaker, clothing, etc.)
2. Assess price legitimacy for this category on ${platform}
3. Evaluate brand authenticity and seller trustworthiness
4. Check for counterfeit indicators specific to this product type
5. Generate UNIQUE, SPECIFIC insights for THIS exact product

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "itemName": "full accurate product name based on URL",
  "brand": "brand name",
  "category": "product category",
  "trustScore": number between 0-100,
  "verdict": "one of: VERIFIED AUTHENTIC, SUSPICIOUS REVIEW / RISK, LIKELY COUNTERFEIT",
  "aiConfidence": number between 75-99,
  "estimatedRetailValue": "price with currency like Rs.999",
  "priceAnalysis": "one of: Fair Market Price, Budget Fast-Fashion Tier, Great Value Deal, Anomalously Cheap / High Risk",
  "whatBuyersLove": ["specific positive aspect 1", "specific positive aspect 2"],
  "whatBuyersDislike": ["specific concern or limitation"],
  "hiddenPattern": "specific observation about this product or seller pattern",
  "curiosityTrigger": "interesting technical or manufacturing detail specific to this product",
  "sentimentBreakdown": { "positive": 65, "neutral": 20, "negative": 15 },
  "detailedScores": {
    "stitchingQuality": 70,
    "typographyAccuracy": 65,
    "fabricTextureMatch": 60,
    "hardwareAuthenticity": 45,
    "serialCodeValidation": 40,
    "reviewPerplexity": 55,
    "reviewSentimentAlignment": 60
  },
  "fakeReviewProbability": 45,
  "xaiReasoning": ["detailed explanation of your forensic findings"],
  "recommendations": ["actionable advice for a buyer of this specific product"]
}`;

  try {
    console.log('Testing with gemini-2.5-flash...');
    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.2 }
    });
    const rawText = r.text;
    console.log('Raw response length:', rawText.length);
    const parsed = JSON.parse(cleanJsonResponse(rawText));
    console.log('\n=== RESULT ===');
    console.log('Product:', parsed.itemName);
    console.log('Brand:', parsed.brand);
    console.log('Trust Score:', parsed.trustScore);
    console.log('Verdict:', parsed.verdict);
    console.log('Price:', parsed.estimatedRetailValue);
    console.log('Love:', parsed.whatBuyersLove);
    console.log('Dislike:', parsed.whatBuyersDislike);
    console.log('Hidden:', parsed.hiddenPattern);
    console.log('Curiosity:', parsed.curiosityTrigger);
    console.log('Score is valid:', typeof parsed.trustScore === 'number' && !parsed.whatBuyersLove[0].includes('[specific'));
  } catch(e) {
    console.error('Error:', e.message);
  }
}

test();
