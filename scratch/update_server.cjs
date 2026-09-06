const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const startMarker = 'function resolveProductIdentity(';
const endMarker = 'export async function handleHistory(';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const replacement = `// Multi-Platform Scraper and Forensic Analyzer (Unified with Vercel API Engine)
export async function handleAnalyzeUrl(req: any, res: any) {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Product URL is required.' });
    }

    const result = await runUniversalGeminiForensics(url);

    try {
      const savedResult = new AnalysisModel(result);
      await savedResult.save();
    } catch (_) {}

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/analyze-url:', err);
    return res.status(500).json({ error: 'Failed to analyze product URL', message: err?.message });
  }
}

`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);

// Add image-proxy route
const routeMarker = 'app.post(["/api/analyze-url", "/analyze-url"], handleAnalyzeUrl);';
content = content.replace(routeMarker, routeMarker + '\napp.get(["/api/image-proxy", "/image-proxy"], imageProxyHandler);');

fs.writeFileSync('server.ts', content, 'utf8');
console.log('Successfully updated server.ts!');
