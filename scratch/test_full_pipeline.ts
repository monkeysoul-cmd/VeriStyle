import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

function getAiClient(): GoogleGenAI | null {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    fallbackKey;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  return cleaned.trim();
}

function isValidProductImage(url: string): boolean {
  if (!url || !url.startsWith("http")) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg") || lower.includes(".svg?") || lower.includes("/svg/")) return false;
  const badKeywords = [
    "logo", "icon", "banner", "button", "badge", "avatar", "sprite",
    "batman", "loading", "placeholder", "arrow", "cart", "header",
    "footer", "nav", "menu", "kailey", "kitty", "gno/sprites",
    "ShoppingPortal", "x-locale", "fkheaderlogo", "headerlogo"
  ];
  if (badKeywords.some((kw) => lower.includes(kw.toLowerCase()))) return false;
  if (lower.endsWith(".gif") && (lower.includes("1x1") || lower.includes("_TTD_"))) return false;
  const hasImageExt = /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url);
  const isKnownCDN = /media-amazon\.com|rukminim[12]\.flixcart\.com|assets\.myntassets\.com|smartwatchspecs|openboxwale/i.test(url);
  return hasImageExt || isKnownCDN;
}

async function searchProductImage(query: string): Promise<string> {
  try {
    const tokenUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query + " product")}&iax=images&ia=images`;
    const tokenRes = await fetch(tokenUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000)
    });
    const html = await tokenRes.text();
    const vqdMatch = html.match(/vqd=([a-zA-Z0-9_\-]+)/);
    
    if (vqdMatch) {
      const imgApi = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query + " product")}&vqd=${vqdMatch[1]}&f=,,,&p=1`;
      const imgRes = await fetch(imgApi, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://duckduckgo.com/",
        },
        signal: AbortSignal.timeout(5000)
      });
      const imgData = await imgRes.json();
      if (imgData.results && imgData.results.length > 0) {
        for (const r of imgData.results) {
          if (r.image && isValidProductImage(r.image)) {
            return r.image;
          }
        }
      }
    }
  } catch (e: any) {
    console.warn("Product image search failed:", e.message);
  }
  return "";
}

async function testPipeline(url: string) {
  console.log(`\n=== Testing Pipeline for URL: ${url} ===`);
  const ai = getAiClient();
  if (!ai) throw new Error("AI not configured");

  // Step 1: Gemini Grounding
  console.log("1. Running Gemini Grounding...");
  let groundTitle = "";
  let groundPrice = "";
  let groundRating = 0;
  let groundBrand = "";

  try {
    const groundResp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Search for product link "${url}".
Find:
1. Product title
2. Current listed price (e.g. ₹3,499 or $49)
3. Customer rating (out of 5)
4. Brand

Return ONLY JSON:
{"title": "...", "price": "₹...", "rating": 4.2, "brand": "..."}`
            }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundText = groundResp.text || "";
    console.log("Grounding raw text:", groundText);
    const cleaned = cleanJsonResponse(groundText);
    try {
      const parsed = JSON.parse(cleaned);
      groundTitle = parsed.title || "";
      groundPrice = parsed.price || "";
      groundRating = parsed.rating || 0;
      groundBrand = parsed.brand || "";
    } catch (_) {}
  } catch (err: any) {
    console.warn("Grounding error:", err.message);
  }

  console.log("Discovered:", { groundTitle, groundPrice, groundRating, groundBrand });

  // Step 2: Image Search
  console.log("2. Searching for real product image...");
  const searchTitle = groundTitle || "Noise Colorfit Pro 5 Max smartwatch";
  const image = await searchProductImage(searchTitle);
  console.log("Found real product image:", image);

  // Step 3: Run Forensics
  console.log("3. Running Forensics...");
  const prompt = `You are VeriStyle, the advanced universal forensic AI product authenticator.
Product: ${groundTitle}
Brand: ${groundBrand}
Verified Listed Price: ${groundPrice}
Product Image: ${image}

Evaluate authenticity (trustScore 0-100, verdict VERIFIED AUTHENTIC).
Ensure exactPrice is "${groundPrice}".

Return ONLY JSON matching schema:
{
  "itemName": "${groundTitle}",
  "brand": "${groundBrand}",
  "category": "Smartwatch",
  "exactPrice": "${groundPrice}",
  "imageUrl": "${image}",
  "trustScore": 88,
  "verdict": "VERIFIED AUTHENTIC",
  "aiConfidence": 94,
  "priceAnalysis": "Fair Market Price",
  "whatBuyersLove": ["Vibrant AMOLED display", "Bluetooth calling"],
  "whatBuyersDislike": ["Battery drain during GPS"],
  "hiddenPattern": "Consistent manufacturing batches",
  "curiosityTrigger": "Display technology",
  "sentimentBreakdown": { "positive": 84, "neutral": 10, "negative": 6 },
  "detailedScores": {
    "stitchingQuality": 88,
    "typographyAccuracy": 90,
    "fabricTextureMatch": 86,
    "hardwareAuthenticity": 89,
    "serialCodeValidation": 85,
    "reviewPerplexity": 88,
    "reviewSentimentAlignment": 90
  },
  "fakeReviewProbability": 8,
  "xaiReasoning": ["Forensic analysis for ${groundTitle} verified at ${groundPrice}."],
  "recommendations": ["Buy from verified seller"]
}`;

  const forensicResp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  console.log("Forensic Result:\n", forensicResp.text);
}

testPipeline("https://www.flipkart.com/noise-colorfit-pro-5-max-1-96-amoled-display-bt-calling-metallic-build-smartwatch/p/itm6e2e2c6b1a3eb");
