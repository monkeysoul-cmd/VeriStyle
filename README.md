# 🛡️ VeriStyle | VeriLens AI Authenticator

<div align="center">

  <h3>✨ Multimodal Fashion Authenticity & Review Forensics Platform ✨</h3>

  <p>
    <b>Powered by VeriLens AI Multimodal Vision Transformer & NLP Perplexity Engine</b>
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-architecture">Architecture</a>
  </p>

</div>

---

## 🌟 Overview

**VeriStyle** is a state-of-the-art multimodal AI platform engineered to detect counterfeit luxury fashion apparel and expose fake reseller bot reviews. By pairing **computer vision micro-pattern inspection** with **NLP linguistic perplexity forensics**, VeriStyle delivers instant 0–100% Trust Index scores, interactive XAI visual heatmap bounding boxes, and immutable digital provenance certificates.

---

## 🚀 Key Features

- 🔍 **VeriLens Micro-Pattern Inspection**: Analyzes stitch pitch density, leather grain texture, hardware electroplating reflectivity, and care-tag typography kerning against brand factory masters.
- 💬 **NLP Review Perplexity & Bot Exposer**: Scans reseller reviews for synthetic text patterns, LLM phrase repetition, bot template markers, and sentiment-versus-image discrepancies.
- 🎯 **Interactive XAI Heatmap Overlays**: Highlights precise micro-regions of authenticity or anomaly directly on uploaded apparel imagery with bounding boxes and technical explanations.
- 📜 **Digital Provenance Vault & QR Certificates**: Generates cryptographically hashed verification receipts complete with QR code validation for resale marketplaces.
- ⚡ **Real-Time Forensic Inspection**: Complete dual-domain vision + text analysis executed in under 2.5 seconds.
- 💻 **FastAPI & REST API Ready**: Built with developer-first OpenAPI / Swagger specs for seamless e-commerce integration.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Vite, TailwindCSS, Motion (Framer Motion) |
| **Icons & Aesthetics** | Lucide React, Custom VeriLens SVG Reticle Design System |
| **AI Neural Core** | VeriLens AI Multimodal Engine (Vision Transformer + NLP Forensics) |
| **Backend API** | Node.js / Express Server (`tsx`), REST Endpoints, OpenAPI Spec |
| **Tooling & Build** | Bun / Node, esbuild, TypeScript Compiler (`tsc`) |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **bun**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/monkeysoul-cmd/VeriStyle.git
cd VeriStyle
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The application will start on **http://localhost:3000**.

---

## ⚡ API Reference

### Authenticity Verification Endpoint

`POST /api/analyze-authenticity`

#### Request Body
```json
{
  "itemName": "Chanel Medium Flap Bag",
  "brand": "Chanel",
  "category": "Handbags",
  "imageUrl": "data:image/jpeg;base64,...",
  "reviewText": "Authentic caviar leather with gold hardware. Serial sticker verified."
}
```

#### Response Body
```json
{
  "id": "scan-k9x2a1",
  "timestamp": "Aug 3, 2026, 9:15 PM",
  "itemName": "Chanel Medium Flap Bag",
  "brand": "Chanel",
  "category": "Handbags",
  "trustScore": 92,
  "verdict": "VERIFIED AUTHENTIC",
  "aiConfidence": 95,
  "fakeReviewProbability": 6,
  "heatmapPoints": [
    {
      "id": "hp-1",
      "x": 38.5,
      "y": 42.0,
      "width": 22.0,
      "height": 18.0,
      "label": "Stitching Pitch Compliant",
      "category": "stitching",
      "severity": "low",
      "description": "Thread density matches 8.4 stitches per inch factory standard."
    }
  ],
  "verificationHash": "0x8f3c419e7a2b"
}
```

---

## 📁 Directory Structure

```text
veristyle/
├── src/
│   ├── components/
│   │   ├── VeriLensLogo.tsx    # Custom VeriLens AI logo emblem
│   │   ├── VeriLensIcon.tsx    # Reusable SVG lens reticle icon
│   │   ├── Header.tsx          # Sticky navigation bar
│   │   ├── LandingPage.tsx     # Hero & 3-step bento box showcase
│   │   ├── Dashboard.tsx       # Interactive AI Inspector & Heatmap viewer
│   │   ├── HistoryView.tsx     # Digital Vault history & hash log
│   │   ├── ApiDocsView.tsx     # FastAPI interactive documentation
│   │   └── Footer.tsx          # Brand footer & system links
│   ├── data/
│   │   └── presets.ts          # Sample luxury fashion test presets
│   ├── App.tsx                 # Main application state & tab manager
│   ├── main.tsx                # Entry point
│   ├── types.ts                # TypeScript data interfaces
│   └── index.css               # Global styling & Tailwind directives
├── server.ts                   # Express backend API & AI engine controller
├── index.html                  # HTML entry point
├── package.json                # Project dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
  <p>Built with ❤️ for Luxury Fashion Authenticators & E-Commerce Security</p>
</div>
