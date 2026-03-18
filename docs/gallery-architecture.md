# Gallery Architecture: Masonry Layout & Image Loading

## Overview

The gallery page displays 40+ (potentially 100+) photos in a Pinterest-style masonry grid with zero layout shift, progressive loading, and optimized thumbnails. This document explains how each piece works and why it's needed.

---

## The Problem

Displaying many large photos in a grid has three challenges:

1. **Flickering / layout shift** — Images have different dimensions. Until an image loads, the browser doesn't know how tall it is. When it finally loads, everything below it jumps down.
2. **Performance** — Raw phone photos are 2–5 MB each. Loading 40+ of them simultaneously would consume 100+ MB of bandwidth.
3. **DOM overload** — Rendering 100+ image components at once, even with lazy loading, creates a heavy DOM and slows the page.

---

## Solution Architecture

```
┌─────────────────────────────────────────────────────┐
│  Build Time (npm run generate-thumbs)               │
│                                                     │
│  scripts/generate-thumbnails.mjs                    │
│    ├── Reads public/gallery/<album>/*.jpg            │
│    ├── Generates 480px-wide thumbnails → thumbs/     │
│    └── Writes dimensions → src/data/gallery-manifest │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Runtime (src/app/gallery/page.tsx)                  │
│                                                     │
│  1. Import gallery-manifest.json (w/h per image)     │
│  2. distributeToColumns() — manual masonry layout    │
│  3. AlbumGrid — batch loading (16 at a time)         │
│  4. GalleryImage — shimmer + fade-in per image       │
│  5. Lightbox — full-res with preloading              │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: The Thumbnail Script

**File:** `scripts/generate-thumbnails.mjs`

### What it does

For every image in `public/gallery/<album>/`:
- Creates a **480px-wide JPEG thumbnail** (quality 75, mozjpeg) in a `thumbs/` subfolder
- Records the **original image dimensions** (width × height) into `src/data/gallery-manifest.json`

### Why thumbnails?

| | Original | Thumbnail |
|---|---|---|
| Width | 3000–4000px | 480px |
| File size | 200–500 KB each | 20–30 KB each |
| Total (40 images) | ~32 MB | ~2.5 MB |

The grid only needs small previews. Full-resolution images are loaded only when the user opens the lightbox.

### Why a manifest?

The manifest stores each image's width and height:

```json
{
  "/gallery/outdoor-games-2023-24/img20240121082344.jpg": { "w": 3000, "h": 4000 },
  "/gallery/outdoor-games-2023-24/img20240121091003.jpg": { "w": 4000, "h": 3000 }
}
```

This is critical for the masonry layout. Without knowing dimensions upfront, the browser can't reserve the correct space for each image, causing layout shift (flickering) when images load.

### When does it run?

- **Automatically before every build** via the `prebuild` script in `package.json`
- **Manually** via `npm run generate-thumbs`
- Skips already-generated thumbnails unless `--force` is passed

---

## Part 2: Masonry Layout

### What is masonry?

A masonry layout (like Pinterest) arranges items in columns where each item has a different height. Items fill columns top-to-bottom, and the next item always goes into the shortest column:

```
┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │
│  A   │ │  B   │ │      │
│      │ │      │ │  C   │
├──────┤ ├──────┤ │      │
│      │ │      │ ├──────┤
│  D   │ │      │ │  F   │
│      │ │  E   │ ├──────┤
│      │ │      │ │      │
├──────┤ ├──────┤ │  G   │
│  H   │ │  I   │ │      │
└──────┘ └──────┘ └──────┘
```

### Why not CSS `columns`?

CSS `columns-*` creates a masonry effect, but has a critical flaw: **when new items are added, ALL items get redistributed across columns**. An image that was in column 1 can jump to column 3, causing a visible reshuffle.

### How our manual masonry works

The `distributeToColumns()` function:

1. Creates N empty columns (2 on mobile, 3 on tablet, 4 on desktop)
2. Tracks the cumulative "height" of each column (using aspect ratios from the manifest)
3. For each image, places it in the **shortest column**
4. Returns an array of columns, each containing its assigned images

```typescript
function distributeToColumns(images, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);

  images.forEach((src, index) => {
    const { w, h } = getDimensions(src);
    // Find shortest column
    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push({ src, index });
    heights[shortest] += h / w; // normalized height
  });

  return columns;
}
```

### Why this is stable

The algorithm is **deterministic and order-preserving**:
- Images 1–16 always end up in the same columns
- When images 17–32 are added (via "Load more"), the function recalculates — but images 1–16 still get the exact same column assignments because the algorithm processes them in order
- New images only **append** to the bottom of their assigned columns
- Existing images never move

### Rendering

Each column is a `flex-col` container. The columns sit side by side in a `flex` row:

```tsx
<div className="flex gap-3">
  {columns.map((col) => (
    <div className="flex flex-1 flex-col gap-3">
      {col.map(({ src, index }) => (
        <GalleryImage key={src} src={src} ... />
      ))}
    </div>
  ))}
</div>
```

---

## Part 3: Image Loading (Zero Flicker)

### The container

Each image has a container with a **pre-set aspect ratio** from the manifest:

```tsx
<div style={{ aspectRatio: `${w}/${h}` }}>
```

This tells the browser exactly how much space to reserve before the image loads. A 3000×4000 image gets `aspect-ratio: 3000/4000` (tall), a 4000×3000 image gets `aspect-ratio: 4000/3000` (wide). **No layout shift.**

### The shimmer placeholder

Inside the container, a shimmer overlay sits on top (via `z-10` and `absolute inset-0`). It's always in the DOM — when the image loads, it fades out via `opacity-0` instead of being removed. This avoids any DOM mutation that could cause a repaint glitch.

### The image element

```tsx
<img
  src={thumbnailPath}
  loading="lazy"         // browser-native lazy loading
  decoding="async"       // don't block the main thread
  onLoad={() => setLoaded(true)}
  onError={() => fallbackToOriginal()}
  className={loaded ? "opacity-100" : "opacity-0"}
/>
```

- `loading="lazy"` — the browser only fetches the image when it's near the viewport
- `decoding="async"` — image decoding happens off the main thread
- `onError` fallback — if the thumbnail doesn't exist, falls back to the original image

### The transition

When the image loads:
1. Shimmer fades out over 700ms (`transition-opacity duration-700`)
2. Image fades in over 700ms (`opacity-0 → opacity-100`)
3. Slight scale-up effect (`scale-[1.02] → scale-100`) for a polished feel

---

## Part 4: Batch Loading

The `AlbumGrid` component only renders the first 16 images initially. A sentinel `<div>` at the bottom triggers loading the next batch via `IntersectionObserver`:

```
Page load:     Images 1–16 rendered
Scroll down:   Sentinel enters viewport → images 17–32 rendered
Scroll more:   Sentinel enters viewport → images 33–48 rendered
...until all images are loaded
```

The sentinel has a `rootMargin: "600px"` — it triggers 600px before the user actually reaches the bottom, so new images start loading before the user sees a gap.

There's also a manual "Load more" button as a fallback if the observer doesn't fire.

---

## Part 5: Lightbox

When a user taps an image in the grid:
- The **full-resolution original** loads (not the thumbnail)
- A spinner shows while it loads
- Adjacent images (prev/next) are **preloaded** in the background
- Keyboard navigation (← → Esc) and swipe gestures are supported
- Body scroll is locked while the lightbox is open

---

## File Summary

| File | Purpose |
|---|---|
| `scripts/generate-thumbnails.mjs` | Generates thumbnails + dimensions manifest at build time |
| `src/data/gallery-manifest.json` | Width/height of every gallery image (auto-generated) |
| `src/app/gallery/page.tsx` | Gallery page with masonry grid, batch loading, lightbox |
| `public/gallery/<album>/` | Original full-resolution images |
| `public/gallery/<album>/thumbs/` | Optimized 480px thumbnails (auto-generated) |

## Milestone: 80th Anniversary (2026)

Rare events (e.g. **80th Anniversary Celebration**, 4 Jan 2026) are **not** tied to year tabs. Opening the featured banner shows a **single masonry grid**: every image in `public/gallery/80th-anniversary-2026/` (except `80th-anniversary-logo.png`) plus **one video tile** (first `.mp4`/`.webm` found). The video is a normal masonry cell (autoplay muted in-grid); tap opens fullscreen with sound. List order comes from **`src/data/80th-anniversary-gallery.json`**, regenerated by `npm run generate-thumbs`.

- **`videoPosition`: `"top"`** — video is placed first in the masonry stream (usually near the top-left). **`"random"`** — deterministic slot among photos (hash-based, stable per build).
- Add or remove files in the folder, then run **`npm run generate-thumbs`** to refresh images, video path, and thumbnails.

## Adding New Images

1. Drop new photos into `public/gallery/<album>/`
2. Run `npm run generate-thumbs` (or it runs automatically on `npm run build`)
3. Add the image paths to the album's `images` array in `page.tsx`
4. The manifest and thumbnails are generated automatically
