async function testAmazonJina() {
  const url = 'https://www.amazon.in/Impulse-EmpowerElite-Resistant-Backpack-Black/dp/B0CSYYK6B9';
  console.log('Testing Jina on Amazon:', url);
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
        'X-With-Images-Summary': 'true',
        'X-No-Cache': 'true'
      },
      signal: AbortSignal.timeout(10000)
    });
    console.log('Jina status:', res.status);
    const text = await res.text();
    console.log('Length:', text.length);
    console.log('First 600 chars:\n', text.substring(0, 600));
  } catch (e) {
    console.log('Jina error:', e.message);
  }
}

testAmazonJina();
