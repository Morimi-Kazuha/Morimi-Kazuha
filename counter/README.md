# Pokémon profile counter

This Worker returns the complete profile composition at `GET /profile.svg` and a standalone Pokémon counter at `GET /counter.svg`. Each GET increments the same persistent D1 row and displays a nine-digit count. HEAD does not increment. Values above `999999999` display as `999999999`.

Production profile endpoint: https://morimi-pokemon-counter.morimi-pokemon-counter.workers.dev/profile.svg

## Local verification

Requires Node.js 20+.

```bash
npm install
npm test
npm run db:local
npm run dev
```

Open `http://127.0.0.1:8787/profile.svg` twice. The displayed count should increase by one. Run `npm run preview -- 2` to render static PNG snapshots in `preview/`; the argument is a preview value, not stored counter data. `npm run prepare:sprites` reproduces the embedded data URI module from the tracked PNGs. `node ../scripts/generate-typing.mjs` reproduces the animated greeting art in both the standalone SVG and Worker module. Local Wrangler configuration is copied from `wrangler.example.jsonc` to the ignored `wrangler.jsonc` on first use.

## Cloudflare deployment

After authenticating with Cloudflare:

1. Run `npx wrangler d1 create profile-visitor-counter`.
2. Put the returned D1 UUID in the ignored `wrangler.jsonc`, replacing the local-only zero UUID. Set `COUNTER_OFFSET` there if an initial display offset is desired; the default is `0`.
3. Run `npx wrangler d1 migrations apply profile-visitor-counter --remote`.
4. Run `npm run deploy` and verify two GET requests against the returned HTTPS `/counter.svg` URL.
5. Replace the local URL in the repository root README with that real HTTPS endpoint.

No API token, `.env`, `.dev.vars`, or account secret belongs in Git. The D1 binding is named `DB`; the migration creates the sole `profile_views` row. Each GET uses one SQLite `UPDATE … RETURNING` statement, avoiding read-then-write lost updates. The raw counter saturates at `999999999`; the optional offset changes display only and is also clamped at nine digits.

This measures counter-image requests, not unique people or exact profile page views. GitHub's image proxy may cache or combine requests despite the Worker response's `no-store` directives. The Worker sets no cookies and records no visitor identifiers.

Sprite provenance and copyright are recorded in [ASSET_SOURCES.md](ASSET_SOURCES.md).
