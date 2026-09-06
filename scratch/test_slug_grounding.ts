import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

function extractMetadataFromUrl(url: string) {
  let platform = "E-Commerce";
  if (url.includes("amazon.")) platform = "amazon";
  else if (url.includes("flipkart.com")) platform = "flipkart";
  else if (url.includes("myntra.com")) platform = "myntra";
  else if (url.includes("ajio.com")) platform = "ajio";
  else if (url.includes("meesho.com")) platform = "meesho";
  else if (url.includes("nykaa.com")) platform = "nykaa";

  let slugTitle = "";
  let asin = "";

  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split("/").filter(Boolean);

    if (platform === "amazon") {
      const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) asin = asinMatch[1].toUpperCase();
      if (segments.length > 0 && !segments[0].match(/^(dp|gp|ref)$/i)) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, " ");
      }
    } else if (platform === "flipkart") {
      if (segments.length > 0) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, " ");
      }
    } else if (segments.length > 0) {
      slugTitle = decodeURIComponent(segments[segments.length - 1]).replace(/[-_+]/g, " ");
    }
  } catch (_) {}

  const titleWords = slugTitle
    .split(" ")
    .filter((w) => w.length > 1 && !/^\d+$/.test(w))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return { platform, slugTitle: titleWords, asin };
}

async function testGroundingQuery() {
  const fallbackKey = Buffer.from(
    "QVEuQWI4Uk42SkR6YnBrUDRqcmtaYy1IaUw5bXdkY21KMThQV3NOcWhHM0tHLTB3WU80Z2c=",
    "base64"
  ).toString("utf-8");
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || fallbackKey;
  const ai = new GoogleGenAI({ apiKey });

  const url = "https://www.flipkart.com/noise-colorfit-pro-5-max-1-96-amoled-display-bt-calling-metallic-build-smartwatch/p/itm6e2e2c6b1a3eb";
  const { platform, slugTitle } = extractMetadataFromUrl(url);

  console.log("Extracted slugTitle:", slugTitle, "Platform:", platform);

  const query = `Product: "${slugTitle}" on ${platform} India. Current selling price, official product name, customer rating, and brand.`;

  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Search the web: ${query}
Return JSON:
{"title": "exact title", "price": "₹...", "rating": 4.2, "brand": "Brand"}`
          }
        ]
      }
    ],
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log("Response text:\n", resp.text);
}

testGroundingQuery();
