async function parseAmazonJina() {
  const url = 'https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9';
  const res = await fetch(`https://r.jina.ai/${url}`, {
    headers: { 'Accept': 'text/plain', 'X-With-Images-Summary': 'true' }
  });
  const text = await res.text();
  console.log('--- Price matches in Jina Amazon ---');
  const priceMatches = [...text.matchAll(/(?:₹|Rs\.?|INR)\s*[\d,]+(?:\.\d{2})?/gi)].map(m => m[0]);
  console.log('Price matches:', priceMatches.slice(0, 10));

  console.log('--- Image matches in Jina Amazon ---');
  const imgMatches = [...text.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9\-_%+]+\.[a-z]{3,4}/gi)].map(m => m[0]);
  console.log('Product images:', [...new Set(imgMatches)].slice(0, 5));
}

parseAmazonJina();
