// Same-origin proxy to Exa, used automatically by the page if the browser blocks a direct call.
// The user's own Exa key arrives in the x-api-key header and is forwarded, never stored or logged.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  const key = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (!key) return { statusCode: 401, body: JSON.stringify({ error: 'Missing Exa key' }) };
  try {
    const r = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: event.body
    });
    return { statusCode: r.status, headers: { 'Content-Type': 'application/json' }, body: await r.text() };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not reach Exa' }) };
  }
};
