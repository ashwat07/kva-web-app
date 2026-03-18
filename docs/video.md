
### Short answer

**100 MB is on the large side** for a file you serve straight from `public/`. It *can* work on fast Wi‑Fi, but many users on **mobile or slower networks** will see long waits, heavy data use, and the browser may struggle to start playback smoothly.

### Rough guidelines (served from your site)

| Context | Reasonable ballpark |
|--------|----------------------|
| **Short clip in gallery (like yours)** | **~5–25 MB** is a comfortable target after compression |
| **Longer highlight reel (1–3 min)** | Often **~15–50 MB** if heavily compressed for web |
| **100 MB** | Usually **only OK** if audience is mostly desktop/Wi‑Fi *and* you accept slow first play; still not ideal |

### Why 100 MB hurts

- The **whole file** (or large chunks) may need to download before smooth playback, especially on cellular.
- It counts against **hosting bandwidth** and **user data caps**.
- **Lighthouse / performance** scores suffer.

### What to do instead

1. **Re-encode for web**: e.g. **720p** (or 1080p if it must look sharp), **H.264** `.mp4`, moderate bitrate (often **2–5 Mbps** for 720p is enough for a commemorative clip).
2. **Trim** to the best **30–90 seconds** if possible.
3. **Tools**: HandBrake, FFmpeg, or “Export for web” in editors.
4. If it must stay huge/long, consider **YouTube / Vimeo embed** so your site doesn’t host the full 100 MB download.

**Recommendation:** aim to get that celebration video **well under ~30 MB** for a much better experience; **100 MB is “big”** for public-folder hosting unless you’re sure everyone has fast, unlimited connections.