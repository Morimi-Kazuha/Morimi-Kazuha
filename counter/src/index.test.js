import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest } from './index.js';

function mockEnvironment(offset = '0') {
  let count = 0;
  let updates = 0;
  return {
    COUNTER_OFFSET: offset,
    get updates() { return updates; },
    DB: {
      prepare(sql) {
        assert.match(sql, /^UPDATE profile_counter/);
        assert.match(sql, /RETURNING count$/);
        return { async first() { updates += 1; count += 1; return { count }; } };
      },
    },
  };
}

test('GET returns dynamic SVG, cache controls, and a growing persistent count', async () => {
  const env = mockEnvironment();
  const request = () => new Request('https://counter.example/counter.svg');
  const first = await handleRequest(request(), env);
  const second = await handleRequest(request(), env);
  assert.equal(first.status, 200);
  assert.match(first.headers.get('Content-Type'), /^image\/svg\+xml/);
  assert.match(first.headers.get('Cache-Control'), /no-store/);
  assert.equal(first.headers.get('CDN-Cache-Control'), 'no-store');
  assert.match(await first.text(), /data-count="000000001"/);
  assert.match(await second.text(), /data-count="000000002"/);
  assert.equal(env.updates, 2);
});

test('HEAD and unsupported paths do not increment', async () => {
  const env = mockEnvironment();
  assert.equal((await handleRequest(new Request('https://counter.example/counter.svg', { method: 'HEAD' }), env)).status, 200);
  assert.equal((await handleRequest(new Request('https://counter.example/profile.svg', { method: 'HEAD' }), env)).status, 200);
  assert.equal((await handleRequest(new Request('https://counter.example/other'), env)).status, 404);
  assert.equal((await handleRequest(new Request('https://counter.example/counter.svg', { method: 'POST' }), env)).status, 405);
  assert.equal(env.updates, 0);
});

test('profile endpoint increments the same stored count and renders the complete composition', async () => {
  const env = mockEnvironment();
  const response = await handleRequest(new Request('https://counter.example/profile.svg'), env);
  assert.equal(response.status, 200);
  const svg = await response.text();
  assert.match(svg, /data-count="000000001"/);
  assert.match(svg, /Hi ~ I'm Kazuha/);
  assert.match(svg, /学习中/);
  assert.equal(env.updates, 1);
});

test('offset is display-only', async () => {
  const response = await handleRequest(new Request('https://counter.example/counter.svg'), mockEnvironment('981254'));
  assert.match(await response.text(), /data-count="000981255"/);
});
