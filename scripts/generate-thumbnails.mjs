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
const force = process.argv.includes("--force");

async function getAlbumDirs() {
  const entries = await readdir(GALLERY_ROOT, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && e.name !== THUMB_DIR);
}

async function processAlbum(albumDir, manifest) {
  const albumPath = join(GALLERY_ROOT, albumDir);
  const thumbPath = join(albumPath, THUMB_DIR);

  await mkdir(thumbPath, { recursive: true });

  const files = await readdir(albumPath);
  const images = files.filter((f) =>
    IMAGE_EXTS.has(extname(f).toLowerCase())
  );

  let created = 0;
  let skipped = 0;

  for (const img of images) {
    const srcPath = join(albumPath, img);
    const ext = extname(img).toLowerCase();
    const name = basename(img, ext);
    const destPath = join(thumbPath, `${name}.jpg`);
    const publicPath = `/gallery/${albumDir}/${img}`;

    const metadata = await sharp(srcPath).metadata();
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
      await sharp(srcPath)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
        .toFile(destPath);
      created++;
    } catch (err) {
      console.error(`  Failed: ${img} — ${err.message}`);
    }
  }

  console.log(
    `  ${albumDir}: ${created} thumbs created, ${skipped} skipped (${images.length} total)`
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

  const count = Object.keys(manifest).length;
  console.log(`\nManifest: ${count} entries → src/data/gallery-manifest.json`);
  console.log("Done!");
}

main().catch(console.error);
