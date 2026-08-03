import { SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'gucci-marmont',
    title: 'Gucci GG Marmont Shoulder Bag',
    brand: 'Gucci',
    category: 'Handbags & Leather',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    defaultReview: 'Ordered this bag online from a top reseller. Leather feels soft and double-G emblem looks shiny. Smells authentic and came with dust bag and authenticity card. 5 stars!',
    expectedVerdict: 'VERIFIED AUTHENTIC',
    description: 'Leather matelassé handbag with antique gold-toned hardware and double G logo.'
  },
  {
    id: 'jordan-travis-scott',
    title: 'Air Jordan 1 Retro High Travis Scott',
    brand: 'Nike / Jordan',
    category: 'Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    defaultReview: 'Great quality shoes best seller ever!! Fast shipping item matches description 100% recommended seller buy with confidence item very cheap compared to stockx!!',
    expectedVerdict: 'LIKELY COUNTERFEIT',
    description: 'Iconic sneaker collaboration featuring reverse swoosh and hidden heel pocket.'
  },
  {
    id: 'chanel-classic-flap',
    title: 'Chanel Medium Classic Double Flap',
    brand: 'Chanel',
    category: 'Handbags & Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    defaultReview: 'Purchased pre-owned at boutique vintage shop. Lambskin leather quilting is crisp, burgundy interior lining matches burgundy dye batch standards, microchip RFID scan verified.',
    expectedVerdict: 'VERIFIED AUTHENTIC',
    description: 'Black quilted caviar leather with gold-tone metal hardware.'
  },
  {
    id: 'supreme-box-logo',
    title: 'Supreme Box Logo Hoodie Navy',
    brand: 'Supreme',
    category: 'Streetwear',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    defaultReview: 'This hoodie is amazing 10/10 product supreme box logo navy blue hoodie heavy cotton soft fleece. Highly recommend seller fast delivery excellent service top grade quality.',
    expectedVerdict: 'SUSPICIOUS REVIEW / RISK',
    description: 'Heavyweight crossgrain fleece sweatshirt with embroidered chest box logo.'
  },
  {
    id: 'lv-neverfull',
    title: 'Louis Vuitton Neverfull MM Monogram',
    brand: 'Louis Vuitton',
    category: 'Handbags',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    defaultReview: 'Monogram canvas pattern aligns symmetrically at side seams. Leather handles have developed a light patina. Serial code FL2189 matches production year and French factory code.',
    expectedVerdict: 'VERIFIED AUTHENTIC',
    description: 'Classic coated canvas tote with natural cowhide leather trim.'
  }
];

export const INITIAL_HISTORY: Array<import('../types').AnalysisResult> = [
  {
    id: 'scan-001',
    timestamp: '2026-08-03 07:45 AM',
    itemName: 'Gucci GG Marmont Shoulder Bag',
    brand: 'Gucci',
    category: 'Handbags',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    reviewText: 'Ordered this bag online from a top reseller. Leather feels soft and double-G emblem looks shiny. Smells authentic and came with dust bag and authenticity card. 5 stars!',
    trustScore: 94,
    verdict: 'VERIFIED AUTHENTIC',
    aiConfidence: 96,
    detailedScores: {
      stitchingQuality: 96,
      typographyAccuracy: 95,
      fabricTextureMatch: 92,
      hardwareAuthenticity: 98,
      serialCodeValidation: 90,
      reviewPerplexity: 88,
      reviewSentimentAlignment: 94
    },
    heatmapPoints: [
      {
        id: 'hp-1',
        x: 42,
        y: 48,
        width: 16,
        height: 14,
        label: 'Antique Gold GG Hardware',
        category: 'hardware',
        anomalyType: 'Authentic Finish',
        confidence: 98,
        severity: 'low',
        description: 'Micro-beveling and weight density match official Gucci GG hardware mold specifications.'
      },
      {
        id: 'hp-2',
        x: 25,
        y: 60,
        width: 20,
        height: 18,
        label: 'Chevrons Matelassé Stitching',
        category: 'stitching',
        anomalyType: 'Consistent Pitch',
        confidence: 96,
        severity: 'low',
        description: 'Thread pitch is uniform at 3.2mm per stitch with zero tension variation or fraying.'
      }
    ],
    reviewFlags: [
      {
        type: 'Natural Sentence Structure',
        severity: 'low',
        explanation: 'Review language demonstrates organic vocabulary distribution and realistic purchase nuance.'
      }
    ],
    fakeReviewProbability: 6,
    xaiReasoning: [
      'Visual hardware spectral analysis matches brass alloy signature of authentic 2022-2025 Gucci production.',
      'Matelassé leather padding density exhibits consistent memory rebound.',
      'Review sentiment aligns with observed physical characteristics without repetitive sales template markers.'
    ],
    recommendations: [
      'Item verified authentic with 96% AI confidence.',
      'Recommend keeping digital VeriStyle certificate on file for resale provenance.'
    ],
    verificationHash: '0x8f3c...9e41b',
    estimatedRetailValue: '$2,590 USD',
    resaleMarketVerdict: 'High Liquidity - Top Tier Condition'
  },
  {
    id: 'scan-002',
    timestamp: '2026-08-02 04:12 PM',
    itemName: 'Air Jordan 1 Retro High Travis Scott',
    brand: 'Nike / Jordan',
    category: 'Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    reviewText: 'Great quality shoes best seller ever!! Fast shipping item matches description 100% recommended seller buy with confidence item very cheap compared to stockx!!',
    trustScore: 28,
    verdict: 'LIKELY COUNTERFEIT',
    aiConfidence: 94,
    detailedScores: {
      stitchingQuality: 24,
      typographyAccuracy: 32,
      fabricTextureMatch: 40,
      hardwareAuthenticity: 30,
      serialCodeValidation: 15,
      reviewPerplexity: 18,
      reviewSentimentAlignment: 22
    },
    heatmapPoints: [
      {
        id: 'hp-3',
        x: 30,
        y: 35,
        width: 25,
        height: 20,
        label: 'Reverse Swoosh Alignment',
        category: 'stitching',
        anomalyType: 'Swoosh Placement Shift',
        confidence: 94,
        severity: 'critical',
        description: 'Reverse swoosh tail angle sits 4.5mm lower than authentic Nike retail pair master templates.'
      },
      {
        id: 'hp-4',
        x: 65,
        y: 20,
        width: 18,
        height: 15,
        label: 'Wings Logo Embossing',
        category: 'typography',
        anomalyType: 'Shallow Debossing',
        confidence: 91,
        severity: 'high',
        description: 'AIR JORDAN font kerning is 12% too wide and gloss finish lacks matte tactile depth.'
      }
    ],
    reviewFlags: [
      {
        type: 'Repeated Reseller Template',
        severity: 'high',
        explanation: 'Review contains 94% string overlap with known bot review network phrases.'
      },
      {
        type: 'Anomalous Price Motivation',
        severity: 'medium',
        explanation: 'Promotes "very cheap compared to StockX" - classic flag for replica vendor incentivized reviews.'
      }
    ],
    fakeReviewProbability: 88,
    xaiReasoning: [
      'Reverse swoosh stitching density is 6.5 stitches/inch vs authentic 9.2 stitches/inch.',
      'Suede nap texture lacks directional color shifting under directional lighting analysis.',
      'E-commerce review text exhibits low perplexity characteristic of synthetic bot generation.'
    ],
    recommendations: [
      'Avoid purchase or initiate buyer protection refund immediately.',
      'Request high-resolution macro photos of size tag and inner shoe board from seller.'
    ],
    verificationHash: '0x2a91...41c8f',
    estimatedRetailValue: '$1,200 USD (Authentic)',
    resaleMarketVerdict: 'FLAGGED - Replica Detected'
  }
];
