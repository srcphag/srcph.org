# Local Development Workflow

This repo is now set up for live development against the Webflow staging site.

## What changed

- `bs-config.js` — `browser-sync` config that serves the repo on `http://localhost:3000` with CORS enabled.
- `package.json` — new `npm run dev` script.
- `js/initializePatch.js` — CABLES asset path now reads from `window.SRCPH_BASE_URL` so it can load assets from localhost in dev.
- Webflow **site custom code** — a small loader was added. On the `*.webflow.io` staging URL it loads CSS/JS from `http://localhost:3000/`. On the production domain it loads from the jsDelivr CDN.

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   This serves the repo on `http://localhost:3000` and watches `css/`, `js/`, and `assets/` for changes.

3. Publish the Webflow site so the new custom code is live on the staging URL.

4. Open the Webflow staging URL in a browser, for example:

   ```
   https://srcphorg.webflow.io/
   ```

   The page will automatically load JS/CSS from `http://localhost:3000/` and the browser-sync live-reload client.

5. Edit any file in `css/` or `js/` and save it. The browser tab should reload automatically.

## How dev mode is detected

Dev mode is active when any of these is true:

- `location.hostname` is `localhost` or `127.0.0.1`
- `location.hostname` ends with `.webflow.io`
- the URL contains `?dev=1`
- `localStorage.setItem('srcph-dev', '1')` was set in the browser console

When dev mode is active, the loader sets:

```javascript
window.SRCPH_BASE_URL = 'http://localhost:3000/';
```

All custom scripts and CABLES assets load from that local URL.

## Production workflow

When the site is viewed on the production domain (`srcph.org`), the loader uses:

```
https://cdn.jsdelivr.net/gh/srcphag/srcph.org_sandbox@main/
```

So after you finish developing:

1. Commit and push your changes to GitHub.
2. Wait a moment for jsDelivr to refresh the cache (or push a new commit if you want to force a fresh URL).
3. The published Webflow site will load the updated code from the CDN.

## Forcing dev mode on production

If you ever need to test local code against the production domain, add `?dev=1` to the URL or run in the browser console:

```javascript
localStorage.setItem('srcph-dev', '1');
location.reload();
```

To disable it:

```javascript
localStorage.removeItem('srcph-dev');
location.reload();
```

## Troubleshooting

- **The page does not reload on save**: make sure `npm run dev` is running and the browser tab is open. Check the browser console for browser-sync connection messages.
- **CSS/JS files fail to load**: confirm the dev server is on `http://localhost:3000` and that CORS headers are present. The `bs-config.js` middleware sets `Access-Control-Allow-Origin: *`.
- **Mixed-content warnings**: loading `http://localhost:3000` from an HTTPS page is normally allowed for localhost in modern browsers. If you still see issues, try the production-domain staging URL (`https://*.webflow.io`) instead of the Webflow Designer preview.
- **CABLES/GLB assets are not local**: make sure `js/initializePatch.js` is using `window.SRCPH_BASE_URL` and that the dev server is running.

## Notes

- The `style.css` file is not loaded by the current Webflow custom code. If you want to use it, add it to the loader or import it from `main.css`.
- Vendor scripts (video.js, GSAP) are still loaded from their CDNs in both dev and production.
