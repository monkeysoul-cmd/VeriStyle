import { analyzeUrlForensics } from "./_analyzer";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }

    const url = body?.url;
    if (!url) {
      return res.status(400).json({ error: "Product URL is required." });
    }

    const result = await analyzeUrlForensics(url);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel Serverless Error in /api/analyze-url:", err);
    return res.status(500).json({
      error: "Failed to analyze product URL",
      message: err?.message || String(err)
    });
  }
}
