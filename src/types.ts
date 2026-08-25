export interface HeatmapPoint {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
  category: 'stitching' | 'typography' | 'texture' | 'hardware' | 'nlp_anomaly' | 'serial';
  anomalyType: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface ReviewFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface DetailedScores {
  stitchingQuality: number; // 0-100
  typographyAccuracy: number; // 0-100
  fabricTextureMatch: number; // 0-100
  hardwareAuthenticity: number; // 0-100
  serialCodeValidation: number; // 0-100
  reviewPerplexity: number; // 0-100
  reviewSentimentAlignment: number; // 0-100
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  itemName: string;
  brand: string;
  category: string;
  imageUrl: string;
  reviewText: string;
  trustScore: number; // 0-100
  verdict: 'VERIFIED AUTHENTIC' | 'LIKELY COUNTERFEIT' | 'SUSPICIOUS REVIEW / RISK' | 'INCONCLUSIVE';
  aiConfidence: number; // 0-100
  detailedScores: DetailedScores;
  heatmapPoints: HeatmapPoint[];
  reviewFlags: ReviewFlag[];
  fakeReviewProbability: number; // 0-100
  xaiReasoning: string[];
  recommendations: string[];
  verificationHash: string;
  estimatedRetailValue: string;
  resaleMarketVerdict: string;
  analysisMode?: 'review_only' | 'image_only' | 'combined';
}

export interface SamplePreset {
  id: string;
  title: string;
  brand: string;
  category: string;
  imageUrl: string;
  defaultReview: string;
  expectedVerdict: 'VERIFIED AUTHENTIC' | 'LIKELY COUNTERFEIT' | 'SUSPICIOUS REVIEW / RISK';
  description: string;
}

// ─── Tapju-style Product Analysis Types ─────────────────────────────────────

export type ProductBadge = 'Top Rated' | 'Budget Pick' | 'Trending' | 'Premium Pick' | 'Best Value';
export type ProductCategory = 'Handbags' | 'Sneakers' | 'Streetwear' | 'Accessories' | 'Watches';
export type InsightIconType = 'camera' | 'star' | 'battery' | 'build' | 'dollar' | 'weight' | 'shield' | 'zap' | 'tag' | 'heart';

export interface ProductReviewInsight {
  title: string;
  description: string;
  iconType: InsightIconType;
  sentiment: 'positive' | 'negative';
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  trustScore: number;            // 0–100
  rating: number;             // 0–5
  reviewCount: number;
  badge: ProductBadge;
  shortDescription: string;
  tags: string[];             // e.g. ["High Rated", "Best Value", "Trending"]
  // Detail page data
  scoreDimensions: {
    buildQuality: number;
    performance: number;
    valueForMoney: number;
    userSatisfaction: number;
  };
  reviewInsights: ProductReviewInsight[];
  sentimentBreakdown: {
    positive: number;         // 0–100 %
    neutral: number;          // 0–100 %
    negative: number;         // 0–100 %
    reviewsAnalyzed: number;
    storesChecked: number;
    accuracyRate: number;
  };
  aiVerdict: string;          // Full paragraph verdict
  hiddenPattern: string;      // "Hidden Buyer Pattern" insight text
  curiosityTrigger: string;   // "What surprised our AI?" text
  mostDiscussedFeature: string;
}

export type SupportedPlatform = 'amazon' | 'flipkart' | 'myntra' | 'unknown';

export interface UrlAnalysisResult extends AnalysisResult {
  productUrl: string;
  platform: SupportedPlatform;
  extractedPrice?: string;
  extractedRating?: number;
  extractedReviewCount?: number;
  scrapedDescription?: string;
  sellerName?: string;
  companyName?: string;
  productImages?: string[];
  sampleReviews?: string[];
  whatBuyersLove?: string[];
  whatBuyersDislike?: string[];
  hiddenPattern?: string;
  curiosityTrigger?: string;
  priceAnalysis?: string;
  sentimentBreakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}


