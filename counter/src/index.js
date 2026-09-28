import { parseOffset, renderCounterSvg } from './render.js';
import { renderProfileSvg } from './profile.js';

const CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
};

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/counter.svg' && url.pathname !== '/profile.svg') {
    return new Response('Not found', { status: 404 });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  if (request.method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: { ...CACHE_HEADERS, 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
  try {
    const offset = parseOffset(env.COUNTER_OFFSET);
    // One SQLite UPDATE is atomic. The migration creates the single row.
    const row = await env.DB.prepare(
      "UPDATE profile_counter SET count = MIN(count + 1, 999999999) WHERE key = 'profile_views' RETURNING count",
    ).first();
    if (!row || !Number.isSafeInteger(row.count)) throw new Error('Counter row is missing');
    const svg = url.pathname === '/profile.svg'
      ? renderProfileSvg(row.count, offset)
      : renderCounterSvg(row.count, offset);
    return new Response(svg, {
      headers: { ...CACHE_HEADERS, 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  } catch (error) {
    console.error('Counter request failed', error);
    return new Response('Counter unavailable', {
      status: 503,
      headers: { ...CACHE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

export default { fetch: handleRequest };
