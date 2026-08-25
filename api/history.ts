import mongoose from "mongoose";

const analysisResultSchema = new mongoose.Schema({
  id: { type: String, required: true },
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

const AnalysisModel = mongoose.models.AnalysisResult || mongoose.model("AnalysisResult", analysisResultSchema);

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(200).json([]);
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    }
    const history = await AnalysisModel.find().sort({ _id: -1 }).limit(50);
    return res.status(200).json(history);
  } catch (err: any) {
    console.warn("History fetch warning:", err.message);
    return res.status(200).json([]);
  }
}
