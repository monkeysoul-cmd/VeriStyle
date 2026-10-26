import http from "http";
import https from "https";

function fetchNative(targetUrl: string, headers: Record<string, string>, redirectCount = 0): Promise<{ statusCode: number; contentType: string; buffer: Buffer }> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 4) {
      return reject(new Error("Too many redirects"));
    }

    let urlToFetch = targetUrl;
    // Replace m.media-amazon.com with images-na.ssl-images-amazon.com (prevents ECONNRESET)
    if (urlToFetch.includes("m.media-amazon.com")) {
      urlToFetch = urlToFetch.replace("m.media-amazon.com", "images-na.ssl-images-amazon.com");
    }

    let parsed: URL;
    try {
      parsed = new URL(urlToFetch);
    } catch (err: any) {
      return reject(new Error("Invalid URL: " + err.message));
    }

    const client = parsed.protocol === "http:" ? http : https;
    const req = client.get(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "http:" ? 80 : 443),
        path: parsed.pathname + parsed.search,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          ...headers,
        },
        timeout: 8000,
      },
      (res) => {
        // Follow redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectLoc = res.headers.location;
          if (!redirectLoc.startsWith("http")) {
            redirectLoc = `${parsed.protocol}//${parsed.hostname}${redirectLoc}`;
          }
          return resolve(fetchNative(redirectLoc, headers, redirectCount + 1));
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const contentType = (res.headers["content-type"] as string) || "image/jpeg";
          resolve({
            statusCode: res.statusCode || 200,
            contentType,
            buffer,
          });
        });
      }
    );

    req.on("error", (err) => {
      // If images-na failed or ECONNRESET on Amazon, try images-eu as secondary
      if (urlToFetch.includes("images-na.ssl-images-amazon.com") && redirectCount === 0) {
        const mirror = urlToFetch.replace("images-na.ssl-images-amazon.com", "images-eu.ssl-images-amazon.com");
        return resolve(fetchNative(mirror, headers, redirectCount + 1));
      }
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Image fetch timed out"));
    });
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let rawUrl = req.query?.url || req.params?.url;
  // If the query was split due to unencoded & in the target image URL, reconstruct it from req.url
  if (req.url && req.url.includes("?url=")) {
    const fullQueryUrl = req.url.substring(req.url.indexOf("?url=") + 5);
    if (fullQueryUrl && fullQueryUrl.startsWith("http")) {
      rawUrl = fullQueryUrl;
    }
  }

  if (!rawUrl || typeof rawUrl !== "string") {
    return res.status(400).json({ error: "Valid image URL is required" });
  }

  let imageUrl = rawUrl.trim();
  try {
    imageUrl = decodeURIComponent(imageUrl);
  } catch (_) {}

  if (!imageUrl.startsWith("http")) {
    return res.status(400).json({ error: "Valid HTTP image URL is required" });
  }

  // Upgrade to HTTPS
  imageUrl = imageUrl.replace(/^http:\/\//i, "https://");

  // Determine optimal referer
  let referer = "https://www.google.com/";
  if (imageUrl.includes("flixcart.com") || imageUrl.includes("flipkart.com")) {
    referer = "https://www.flipkart.com/";
  } else if (imageUrl.includes("myntra") || imageUrl.includes("myntassets")) {
    referer = "https://www.myntra.com/";
  } else if (imageUrl.includes("amazon.") || imageUrl.includes("ssl-images-amazon.com")) {
    referer = "https://www.amazon.in/";
  } else if (imageUrl.includes("ajio")) {
    referer = "https://www.ajio.com/";
  } else if (imageUrl.includes("nykaa")) {
    referer = "https://www.nykaa.com/";
  } else if (imageUrl.includes("tatacliq")) {
    referer = "https://www.tatacliq.com/";
  } else if (imageUrl.includes("croma")) {
    referer = "https://www.croma.com/";
  } else if (imageUrl.includes("meesho")) {
    referer = "https://www.meesho.com/";
  }

  try {
    const { statusCode, contentType, buffer } = await fetchNative(imageUrl, {
      Referer: referer,
    });

    if (statusCode >= 400 || buffer.length === 0) {
      return res.status(statusCode >= 400 ? statusCode : 404).json({
        error: `Upstream image server returned HTTP ${statusCode}`,
      });
    }

    // Verify it's actually an image (not HTML error payload)
    if (buffer.length < 1000 && buffer.toString("utf-8", 0, 50).includes("<html")) {
      return res.status(404).json({ error: "Upstream returned HTML instead of image" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.status(200).send(buffer);
  } catch (err: any) {
    console.warn("[ImageProxy] Warning:", err.message);
    return res.status(502).json({ error: "Failed to fetch upstream image", message: err.message });
  }
}
