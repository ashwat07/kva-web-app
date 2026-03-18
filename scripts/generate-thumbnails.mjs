#!/usr/bin/env node

/**
 * Generates optimized thumbnails and a dimensions manifest for gallery images.
 * Run: node scripts/generate-thumbnails.mjs [--force]
 *
 * For each image in public/gallery/<album>/:
 *   - Creates a 480px-wide JPEG thumbnail in public/gallery/<album>/thumbs/
 *   - Records width/height in src/data/gallery-manifest.json
 */

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const GALLERY_ROOT = join(process.cwd(), "public", "gallery");
const MANIFEST_PATH = join(process.cwd(), "src", "data", "gallery-manifest.json");
const THUMB_DIR = "thumbs";
const THUMB_WIDTH = 480;
const THUMB_QUALITY = 75;
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTS = new Set([".mp4", ".webm"]);
const ANNIVERSARY_ALBUM = "80th-anniversary-2026";
const ANNIVERSARY_GALLERY_JSON = join(
  process.cwd(),
  "src",
  "data",
  "80th-anniversary-gallery.json"
);
const force = process.argv.includes("--force");

async function getAlbumDirs() {
  const entries = await readdir(GALLERY_ROOT, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && e.name !== THUMB_DIR);
}

/** Collect image files under album (recursive); skip `thumbs` dirs. */
async function collectAlbumImages(absDir, relFromAlbum, out) {
  const entries = await readdir(absDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === THUMB_DIR) continue;
    const rel = relFromAlbum ? `${relFromAlbum}/${e.name}` : e.name;
    const full = join(absDir, e.name);
    if (e.isDirectory()) {
      await collectAlbumImages(full, rel, out);
    } else if (IMAGE_EXTS.has(extname(e.name).toLowerCase())) {
      out.push({ full, rel });
    }
  }
}

/** Nested paths use thumbs/name with slashes → double underscores (youth/a.jpg → youth__a.jpg). */
function thumbFileNameForRel(rel) {
  const ext = extname(rel);
  const base = rel.slice(0, -ext.length);
  return `${base.replace(/\//g, "__")}.jpg`;
}

async function processAlbum(albumDir, manifest) {
  const albumPath = join(GALLERY_ROOT, albumDir);
  const thumbPath = join(albumPath, THUMB_DIR);

  await mkdir(thumbPath, { recursive: true });

  const images = [];
  await collectAlbumImages(albumPath, "", images);

  let created = 0;
  let skipped = 0;

  for (const { full, rel } of images) {
    const thumbName = thumbFileNameForRel(rel);
    const destPath = join(thumbPath, thumbName);
    const publicPath = `/gallery/${albumDir}/${rel.replace(/\\/g, "/")}`;

    const metadata = await sharp(full).metadata();
    manifest[publicPath] = {
      w: metadata.width,
      h: metadata.height,
    };

    if (!force) {
      try {
        await stat(destPath);
        skipped++;
        continue;
      } catch {
        // thumbnail doesn't exist
      }
    }

    try {
      await sharp(full)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
        .toFile(destPath);
      created++;
    } catch (err) {
      console.error(`  Failed: ${rel} — ${err.message}`);
    }
  }

  console.log(
    `  ${albumDir}: ${created} thumbs created, ${skipped} skipped (${images.length} total)`
  );
}

/** Collect images + videos for 80th album; exclude logo & thumbs. */
async function collect80thGalleryMedia(absDir, relFromAlbum, imagesOut, videosOut) {
  const entries = await readdir(absDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === THUMB_DIR) continue;
    const rel = relFromAlbum ? `${relFromAlbum}/${e.name}` : e.name;
    const full = join(absDir, e.name);
    if (e.isDirectory()) {
      await collect80thGalleryMedia(full, rel, imagesOut, videosOut);
    } else {
      const ext = extname(e.name).toLowerCase();
      const pub = `/gallery/${ANNIVERSARY_ALBUM}/${rel.replace(/\\/g, "/")}`;
      if (e.name.toLowerCase() === "80th-anniversary-logo.png") continue;
      if (IMAGE_EXTS.has(ext)) imagesOut.push(pub);
      else if (VIDEO_EXTS.has(ext)) videosOut.push(pub);
    }
  }
}

async function write80thAnniversaryGallery() {
  const albumPath = join(GALLERY_ROOT, ANNIVERSARY_ALBUM);
  try {
    await stat(albumPath);
  } catch {
    return;
  }
  const images = [];
  const videos = [];
  await collect80thGalleryMedia(albumPath, "", images, videos);
  images.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  videos.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  const payload = {
    images,
    video: videos[0] ?? null,
    /** "top" = video processed first in masonry; "random" = deterministic slot among images */
    videoPosition: "top",
  };
  await writeFile(ANNIVERSARY_GALLERY_JSON, JSON.stringify(payload, null, 2) + "\n");
  console.log(
    `\n  ${ANNIVERSARY_ALBUM} gallery list → src/data/80th-anniversary-gallery.json (${images.length} images, ${videos.length ? 1 : 0} video tile)`
  );
}

async function main() {
  console.log("Generating gallery thumbnails + manifest...\n");

  const albumDirs = await getAlbumDirs();
  if (albumDirs.length === 0) {
    console.log("No album directories found in public/gallery/");
    return;
  }

  const manifest = {};

  for (const dir of albumDirs) {
    await processAlbum(dir.name, manifest);
  }

  await mkdir(join(process.cwd(), "src", "data"), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  await write80thAnniversaryGallery();

  const count = Object.keys(manifest).length;
  console.log(`\nManifest: ${count} entries → src/data/gallery-manifest.json`);
  console.log("Done!");
}

main().catch(console.error);
