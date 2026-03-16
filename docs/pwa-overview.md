# How PWA Works in This App

## What is a PWA?

A **Progressive Web App** is a website that can be installed on a phone or desktop and behave like a native app: icon on the home screen, full-screen window (no browser UI), offline support, and optional push notifications. No app store required.

---

## How It’s Set Up Here

### 1. **next-pwa** (in `next.config.ts`)

The `next-pwa` package:

- **Build time:** Generates a **service worker** (`public/sw.js`) and a Workbox-based worker that:
  - **Precaches** your static assets (JS, CSS, fonts, images listed at build time) so repeat visits and offline loads are fast.
  - **Runtime caching:** Uses strategies like “network first” or “stale while revalidate” for API calls and other requests so the app can work with flaky or no network.
- **Register:** Injects a small script that registers the service worker in the browser (`navigator.serviceWorker.register('/sw.js')`).
- **skipWaiting:** New service workers activate immediately instead of waiting for all tabs to close.

So: after the first visit, the browser keeps a copy of your app. When the user opens the app again (or goes offline), the service worker can serve that copy.

### 2. **Web App Manifest** (`public/manifest.json`)

The manifest tells the browser/OS how to treat the app when “installed”:

| Field | Purpose |
|-------|--------|
| `name` / `short_name` | Shown under the icon and in the task switcher. |
| `start_url` | URL opened when the user taps the home-screen icon (e.g. `/`). |
| `display: "standalone"` | Opens in its own window (no URL bar, no browser tabs). |
| `background_color` | Used as the fill before the first paint (e.g. splash). |
| `theme_color` | Color of the status bar / task bar. |
| `icons` | Icons for “Add to Home Screen” and splash. `purpose: "maskable"` means the icon can be cropped into a shape (e.g. circle) by the OS. |

When the user chooses “Add to Home Screen” (or “Install app”), the browser uses this file to create the shortcut, pick the icon, and open in standalone mode.

### 3. **Splash Screen**

- **Your in-app splash** (`SplashScreen.tsx`): A full-screen gradient with logo and “KVA” text that shows for ~2.7s after the app loads. Purely in-page (React).
- **System splash**: Before your JS runs, the OS may show a splash using `background_color` and `icons` from the manifest. That’s why those values are set to match your brand (gold).

### 4. **Safe Area (Notch / Home Indicator)**

On notched phones (e.g. iPhone X+), content can be drawn under the notch or the home indicator. To avoid that:

- **`viewport-fit=cover`** in the layout viewport lets the page extend into those areas.
- **`env(safe-area-inset-top/left/right/bottom)`** in CSS adds padding so the splash (and any full-screen UI) stays inside the “safe” rectangle.

The splash screen uses these insets so the logo and text are not cut at the edges.

---

## Flow Summary

1. User visits the site → service worker installs and caches assets.
2. User taps “Add to Home Screen” → browser uses the manifest to create the app icon and standalone window.
3. Next open from the icon → `start_url` loads, system splash (from manifest) may show, then your React splash, then the app. Cached assets can make this feel instant and work offline when the SW serves from cache.

---

## Files Involved

| File | Role |
|------|------|
| `next.config.ts` | Wraps config with `withPWA()` so the service worker is built and registered. |
| `public/manifest.json` | Install behavior, icons, theme, display mode. |
| `public/sw.js` | Generated service worker (do not edit by hand). |
| `public/workbox-*.js` | Workbox runtime used by the SW. |
| `src/app/layout.tsx` | Viewport (e.g. `viewport-fit=cover`, theme color), manifest link, apple-web-app meta. |
| `src/components/SplashScreen.tsx` | In-app first-screen UI and safe-area padding. |
