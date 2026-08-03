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
