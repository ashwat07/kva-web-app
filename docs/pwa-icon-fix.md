# PWA Homescreen Icon — How It Works & What Was Fixed

## How the homescreen icon appears

When a user adds the KVA web app to their homescreen ("Add to Home Screen"), the device picks an icon from the app's configuration:

- **iOS (Safari):** Uses the `apple-touch-icon` defined in `<link rel="apple-touch-icon">` inside `layout.tsx`. iOS applies its own **rounded-corner mask** to the icon automatically — there's no way to control the mask shape.
- **Android (Chrome):** Uses icons from `public/manifest.json`. Android applies a **circle or squircle mask** depending on the device/launcher. If a `maskable` icon is available, Android uses that and applies its safe-zone mask.

## How it works internally

### Icon files

| File | Size | Used by | Purpose |
|------|------|---------|---------|
| `public/apple-touch-icon.png` | 180×180 | iOS Safari | Homescreen icon on iPhones/iPads |
| `public/icon-192x192.png` | 192×192 | Android / `manifest.json` | Small homescreen icon (`purpose: "any"`) |
| `public/icon-512x512.png` | 512×512 | Android / `manifest.json` | Large icon, splash screens (`purpose: "any"`) |
| `public/icon-maskable-512.png` | 512×512 | Android / `manifest.json` | Maskable icon with safe-zone padding (`purpose: "maskable"`) |

### How they're referenced

1. **`src/app/layout.tsx`** — Next.js metadata defines the icons:
   ```tsx
   icons: {
     icon: [{ url: "/kva-logo.png", type: "image/png", sizes: "any" }],
     apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
   }
   ```
   Plus a manual `<link rel="apple-touch-icon">` in `<head>` for iOS.

2. **`public/manifest.json`** — The PWA manifest lists three icon entries:
   - `icon-192x192.png` → `purpose: "any"` (standard icon)
   - `icon-512x512.png` → `purpose: "any"` (high-res icon)
   - `icon-maskable-512.png` → `purpose: "maskable"` (safe-zone aware)

### What is a "maskable" icon?

Android can apply different mask shapes (circle, rounded square, teardrop, etc.) depending on the launcher. A **maskable icon** guarantees a **safe zone** — the important content is within the inner 80% of the canvas, and the outer 10% on each side is treated as expendable padding. This prevents the logo from being clipped regardless of mask shape.

```
┌──────────────────────┐
│  ░░░░░░░░░░░░░░░░░░  │  ← Outer 10%: may be clipped
│  ░┌──────────────┐░  │
│  ░│              │░  │
│  ░│   SAFE ZONE  │░  │  ← Inner 80%: always visible
│  ░│   (logo)     │░  │
│  ░│              │░  │
│  ░└──────────────┘░  │
│  ░░░░░░░░░░░░░░░░░░  │
└──────────────────────┘
```

## What was broken

The original icons had two problems:

1. **`apple-touch-icon.png` was 535×467 (not square!)** — iOS expects a square image. The non-square image was being stretched and then masked with rounded corners, causing visible distortion and clipping on all edges.

2. **`icon-192x192.png` and `icon-512x512.png` had the logo filling edge-to-edge** with zero padding. When Android applied its circle/squircle mask to these `purpose: "any"` icons, the outer portions of the logo (especially the Kannada text around the border) were cut off.

3. **Only `icon-maskable-512.png` was correct** — it had the gold (`#D4920B`) background with proper padding, keeping the logo within the safe zone.

## What was fixed

Regenerated all three problematic icons from the correctly-padded `icon-maskable-512.png` source:

```bash
# 512x512 — replaced edge-to-edge version with padded version
cp icon-maskable-512.png icon-512x512.png

# 192x192 — resized from padded source
sips -z 192 192 --out icon-192x192.png icon-maskable-512.png

# apple-touch-icon — resized to standard 180x180 square from padded source
sips -z 180 180 --out apple-touch-icon.png icon-maskable-512.png
```

### Before vs After

| Icon | Before | After |
|------|--------|-------|
| `apple-touch-icon.png` | 535×467, non-square, logo edge-to-edge | 180×180, square, gold bg with padding |
| `icon-192x192.png` | 192×192, logo edge-to-edge | 192×192, gold bg with padding |
| `icon-512x512.png` | 512×512, logo edge-to-edge | 512×512, gold bg with padding |

### Result

The KVA logo now displays fully on all devices without any clipping, regardless of the mask shape the OS applies.

> **Note:** Users who previously added the app to their homescreen may need to remove and re-add it to see the updated icon, as homescreen icons are cached by the OS.
