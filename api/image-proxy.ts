export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const imageUrl = req.query?.url;
  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
    return res.status(400).json({ error: "Valid image URL is required" });
  }

  // Determine the best Referer header based on the image CDN
  let referer = "https://www.google.com/";
  if (imageUrl.includes("flixcart.com") || imageUrl.includes("flipkart.com")) {
    referer = "https://www.flipkart.com/";
  } else if (imageUrl.includes("amazon.com") || imageUrl.includes("media-amazon.com")) {
    referer = "https://www.amazon.in/";
  } else if (imageUrl.includes("myntra") || imageUrl.includes("myntassets")) {
    referer = "https://www.myntra.com/";
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": referer,
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch upstream image" });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const arrayBuffer = await response.arrayBuffer();
    
    // Verify it's actually image data (not an error page HTML)
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 1000 && buffer.toString("utf-8", 0, 50).includes("<html")) {
      return res.status(404).json({ error: "Upstream returned HTML instead of image" });
    }
    
    return res.status(200).send(buffer);
  } catch (err: any) {
    console.error("[ImageProxy] Error:", err.message);
    return res.status(500).json({ error: "Internal error fetching image" });
  }
}
