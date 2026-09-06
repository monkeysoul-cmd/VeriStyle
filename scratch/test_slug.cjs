function extractMetadataFromUrl(url) {
  let platform = "E-Commerce";
  if (url.includes("amazon.")) platform = "amazon";
  else if (url.includes("flipkart.com")) platform = "flipkart";
  else if (url.includes("myntra.com")) platform = "myntra";
  else if (url.includes("ajio.com")) platform = "ajio";
  else if (url.includes("meesho.com")) platform = "meesho";
  else if (url.includes("nykaa.com")) platform = "nykaa";

  let slugTitle = "";
  let asin = "";

  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split("/").filter(Boolean);

    if (platform === "amazon") {
      const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) asin = asinMatch[1].toUpperCase();
      if (segments.length > 0 && !segments[0].match(/^(dp|gp|ref)$/i)) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, " ");
      }
    } else if (platform === "flipkart") {
      if (segments.length > 0) {
        slugTitle = decodeURIComponent(segments[0]).replace(/[-_+]/g, " ");
      }
    } else if (segments.length > 0) {
      slugTitle = decodeURIComponent(segments[segments.length - 1]).replace(/[-_+]/g, " ");
    }
  } catch (_) {}

  // PRESERVE model numbers and technical specs
  const cleanTitle = slugTitle
    .replace(/[^\w\s\.\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return { platform, slugTitle: cleanTitle, asin };
}

const urls = [
  "https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9",
  "https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX1W1XY",
  "https://www.amazon.in/dp/B08N5WRWNW",
  "https://www.flipkart.com/xn-xeezos-13-bk-brecelet-led-analog-watch-men/p/itmd69d258f7fd98?pid=WATG3N75YM9JZTPH",
  "https://www.flipkart.com/realme-p4x-5g-matte-silver-128-gb/p/itm575b1540859e4?pid=MOBHN7A8HYC9BPAU",
  "https://www.flipkart.com/mivi-fort-h350-soundbar-350-watts-5-1-channel-multi-input-eq-modes-bt-v5-1-w-bluetooth-soundbar/p/itm38449f86ec63f",
  "https://www.myntra.com/shirts/roadster/roadster-men-casual-shirt/12345/buy",
  "https://www.myntra.com/watches/boat/boat-storm-call-smartwatch/24567/buy"
];

for (const u of urls) {
  console.log(u, '->', extractMetadataFromUrl(u));
}
