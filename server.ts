import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { runUniversalGeminiForensics } from "./api/analyze-url";
import { runMultimodalAuthenticityForensics } from "./api/analyze-authenticity";
import imageProxyHandler from "./api/image-proxy";

dotenv.config();

const analysisResultSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: String,
  itemName: String,
  brand: String,
  category: String,
  imageUrl: String,
  reviewText: String,
  trustScore: Number,
  verdict: String,
  aiConfidence: Number,
  detailedScores: mongoose.Schema.Types.Mixed,
  heatmapPoints: mongoose.Schema.Types.Mixed,
  reviewFlags: mongoose.Schema.Types.Mixed,
  fakeReviewProbability: Number,
  xaiReasoning: [String],
  recommendations: [String],
  verificationHash: String,
  estimatedRetailValue: String,
  resaleMarketVerdict: String,
  productUrl: String,
  platform: String,
  extractedPrice: String,
  extractedRating: Number,
  extractedReviewCount: Number,
  scrapedDescription: String,
  sellerName: String,
  companyName: String,
  productImages: [String],
  sampleReviews: [String],
  whatBuyersLove: [String],
  whatBuyersDislike: [String],
  hiddenPattern: String,
  curiosityTrigger: String,
  priceAnalysis: String,
  sentimentBreakdown: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const AnalysisModel = mongoose.models.AnalysisResult || mongoose.model('AnalysisResult', analysisResultSchema);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Cached MongoDB connection for local dev & serverless functions
let isMongoConnecting = false;
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1 || isMongoConnecting) return;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return;
  try {
    isMongoConnecting = true;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log("Connected to MongoDB!");
  } catch (err: any) {
    console.warn("MongoDB connection notice:", err.message);
  } finally {
    isMongoConnecting = false;
  }
}

// Database middleware - runs BEFORE routes
app.use(async (_req, _res, next) => {
  await connectToDatabase();
  next();
});

// API Route Handlers
export async function handleHealth(req: any, res: any) {
  res.json({
    status: "ok",
    app: "VeriStyle AI Fashion Authenticator",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
}

export async function handleAnalyzeAuthenticity(req: any, res: any) {
  try {
    const result = await runMultimodalAuthenticityForensics(req.body);

    if (mongoose.connection.readyState === 1) {
      const savedResult = new AnalysisModel(result);
      savedResult.save().catch((e: any) => console.warn("Failed to save to DB:", e.message));
    }

    return res.json(result);
  } catch (error: any) {
    console.error("Authenticity Analysis Error:", error.message);
    res.status(400).json({ error: error.message || "Failed to process authenticity scan." });
  }
}

// Multi-Platform Scraper and Forensic Analyzer (Unified with Vercel API Engine)
export async function handleAnalyzeUrl(req: any, res: any) {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Product URL is required.' });
    }

    const result = await runUniversalGeminiForensics(url);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/analyze-url:', err);
    return res.status(500).json({ error: 'Failed to analyze product URL', message: err?.message });
  }
}

export async function handleHistory(req: any, res: any) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const history = await AnalysisModel.find().sort({ _id: -1 }).limit(50);
    return res.json(history);
  } catch (err: any) {
    console.warn("Error fetching history:", err?.message);
    return res.json([]);
  }
}

// Register Express routes for local dev server
app.get(["/api/health", "/health"], handleHealth);
app.post(["/api/analyze-authenticity", "/analyze-authenticity"], handleAnalyzeAuthenticity);
app.post(["/api/analyze-url", "/analyze-url"], handleAnalyzeUrl);
app.get(["/api/image-proxy", "/image-proxy"], imageProxyHandler);
app.get(["/api/history", "/history"], handleHistory);

async function startServer() {
  await connectToDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VeriStyle server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
