"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import galleryManifest from "@/data/gallery-manifest.json";
import anniversary80Gallery from "@/data/80th-anniversary-gallery.json";

const BATCH_SIZE = 16;

const manifest = galleryManifest as Record<string, { w: number; h: number }>;

function getThumbSrc(src: string): string {
  const prefix = "/gallery/";
  if (!src.startsWith(prefix)) return src;
  const rest = src.slice(prefix.length);
  const parts = rest.split("/").filter(Boolean);
  if (parts.length < 2) return src;
  const albumDir = parts[0];
  if (parts.length === 2) {
    const file = parts[1];
    const dot = file.lastIndexOf(".");
    const name = dot !== -1 ? file.slice(0, dot) : file;
    return `/gallery/${albumDir}/thumbs/${name}.jpg`;
  }
  const fileName = parts[parts.length - 1];
  const subParts = parts.slice(1, -1);
  const dot = fileName.lastIndexOf(".");
  const stem = dot !== -1 ? fileName.slice(0, dot) : fileName;
  const base =
    subParts.length > 0 ? `${subParts.join("/")}/${stem}` : stem;
  const thumbKey = base.replace(/\//g, "__");
  return `/gallery/${albumDir}/thumbs/${thumbKey}.jpg`;
}

function getDimensions(src: string): { w: number; h: number } {
  return manifest[src] ?? { w: 4, h: 3 };
}

function GalleryImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const imgSrc = useFallback ? src : getThumbSrc(src);
  const { w, h } = getDimensions(src);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl"
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80"
        style={{ aspectRatio: `${w}/${h}` }}
      >
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-700 ${
            loaded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent bg-[length:200%_100%]"
            style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
          />
          <svg
            className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-amber-200/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!useFallback) setUseFallback(true);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
            loaded ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

interface GalleryAlbum {
  year: string;
  title: string;
  icon: string;
  cover: string;
  images: string[];
}

function useColumnCount() {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCols(4);
      else if (w >= 768) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

/**
 * Distributes images into columns using a shortest-column-first algorithm.
 * Deterministic: adding more images at the end never changes where
 * previous images were placed, so existing items don't move.
 */
function distributeToColumns(
  images: string[],
  columnCount: number
): { src: string; index: number }[][] {
  const columns: { src: string; index: number }[][] = Array.from(
    { length: columnCount },
    () => []
  );
  const heights = new Array(columnCount).fill(0);

  images.forEach((src, index) => {
    const { w, h } = getDimensions(src);
    const normalizedHeight = h / w;

    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }

    columns[shortest].push({ src, index });
    heights[shortest] += normalizedHeight;
  });

  return columns;
}

type AnniversaryGalleryData = {
  images: string[];
  video: string | null;
  videoPosition: "top" | "random";
};

const anniversary80Data = anniversary80Gallery as AnniversaryGalleryData;

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return Math.abs(h);
}

type MixedMasonryCell =
  | { kind: "video"; src: string; key: string }
  | { kind: "image"; src: string; imgIndex: number; key: string };

function buildAnniversaryMasonryCells(
  images: string[],
  video: string | null,
  position: "top" | "random"
): MixedMasonryCell[] {
  const imgCells: MixedMasonryCell[] = images.map((src, i) => ({
    kind: "image",
    src,
    imgIndex: i,
    key: `img-${i}`,
  }));
  if (!video) return imgCells;
  const v: MixedMasonryCell = { kind: "video", src: video, key: "video" };
  if (position === "top") return [v, ...imgCells];
  const idx = hashStr(video) % (imgCells.length + 1);
  const out = [...imgCells];
  out.splice(idx, 0, v);
  return out;
}

function distributeAnniversaryCells(
  cells: MixedMasonryCell[],
  columnCount: number
): MixedMasonryCell[][] {
  const columns: MixedMasonryCell[][] = Array.from(
    { length: columnCount },
    () => []
  );
  const heights = new Array(columnCount).fill(0);

  cells.forEach((cell) => {
    const { w, h } =
      cell.kind === "video"
        ? { w: 9, h: 16 }
        : getDimensions(cell.src);
    const normalizedHeight = h / w;
    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(cell);
    heights[shortest] += normalizedHeight;
  });

  return columns;
}

function MasonryVideoTile({
  src,
  onExpand,
}: {
  src: string;
  onExpand: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const encoded = encodeURI(src);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) v.pause();
      else void v.play().catch(() => {});
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [src]);

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl ring-2 ring-amber-500/50 shadow-md transition-shadow hover:ring-amber-400"
      onClick={onExpand}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-black"
        style={{ aspectRatio: "9/16" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={encoded}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
          <span className="rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
            Video
          </span>
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-kva-text">
            Tap to expand
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoExpandModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const encoded = encodeURI(src);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", h);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", h);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm hover:bg-white/25"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <video
        className="max-h-[90dvh] max-w-full rounded-lg"
        src={encoded}
        controls
        playsInline
        autoPlay
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function AnniversaryMixedGrid({
  images,
  video,
  videoPosition,
  onImageClick,
  onVideoExpand,
}: {
  images: string[];
  video: string | null;
  videoPosition: "top" | "random";
  onImageClick: (imageIndex: number) => void;
  onVideoExpand: () => void;
}) {
  const allCells = useMemo(
    () => buildAnniversaryMasonryCells(images, video, videoPosition),
    [images, video, videoPosition]
  );
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const columnCount = useColumnCount();
  const hasMore = visibleCount < allCells.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, allCells.length)
          );
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, allCells.length, visibleCount]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [images, video, videoPosition]);

  const visibleCells = allCells.slice(0, visibleCount);
  const columns = distributeAnniversaryCells(visibleCells, columnCount);

  if (allCells.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/30 bg-kva-bg-alt/80 py-16 text-center">
        <p className="text-kva-text-light">
          Add photos or video to{" "}
          <code className="rounded bg-gray-100 px-1 text-sm">
            public/gallery/80th-anniversary-2026/
          </code>{" "}
          and run{" "}
          <code className="rounded bg-gray-100 px-1 text-sm">
            npm run generate-thumbs
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-3">
            {col.map((cell) =>
              cell.kind === "video" ? (
                <MasonryVideoTile
                  key={cell.key}
                  src={cell.src}
                  onExpand={onVideoExpand}
                />
              ) : (
                <GalleryImage
                  key={cell.key}
                  src={cell.src}
                  alt={`80th Anniversary — photo ${cell.imgIndex + 1}`}
                  onClick={() => onImageClick(cell.imgIndex)}
                />
              )
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + BATCH_SIZE, allCells.length)
              )
            }
            className="flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary/20"
          >
            Load more ({allCells.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}

function AlbumGrid({
  album,
  onImageClick,
}: {
  album: GalleryAlbum;
  onImageClick: (index: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const columnCount = useColumnCount();
  const hasMore = visibleCount < album.images.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, album.images.length)
          );
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, album.images.length, visibleCount]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [album]);

  const visibleImages = album.images.slice(0, visibleCount);
  const columns = distributeToColumns(visibleImages, columnCount);

  if (album.images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/30 bg-kva-bg-alt/80 py-16 text-center">
        <p className="text-kva-text-light">
          Photos from this celebration will appear here soon.
        </p>
        <p className="mt-2 text-sm text-kva-text-light">
          Share images at{" "}
          <span className="font-semibold text-primary-dark">
            kvamumbai1962@gmail.com
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-3">
            {col.map(({ src, index }) => (
              <GalleryImage
                key={src}
                src={src}
                alt={`${album.title} - Photo ${index + 1}`}
                onClick={() => onImageClick(index)}
              />
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + BATCH_SIZE, album.images.length)
              )
            }
            className="flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Load more ({album.images.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {!hasMore && visibleCount > BATCH_SIZE && (
        <p className="py-6 text-center text-sm text-kva-text-light">
          All {album.images.length} photos loaded
        </p>
      )}
    </>
  );
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    const preload = [currentIndex - 1, currentIndex + 1].filter(
      (i) => i >= 0 && i < images.length
    );
    preload.forEach((i) => {
      const img = new window.Image();
      img.src = images[i];
    });
  }, [currentIndex, images]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1)
        onNavigate(currentIndex + 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [currentIndex, images.length, onClose, onNavigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 60) {
      if (delta > 0 && currentIndex > 0) onNavigate(currentIndex - 1);
      if (delta < 0 && currentIndex < images.length - 1)
        onNavigate(currentIndex + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const res = await fetch(images[currentIndex]);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download =
                images[currentIndex].split("/").pop() || "photo.jpg";
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              window.open(images[currentIndex], "_blank");
            }
          }}
          aria-label="Download"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
            />
          </svg>
        </button>
        <button
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {currentIndex > 0 && (
        <button
          className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-4"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      <div
        className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && (
          <div className="flex h-48 w-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          onLoad={() => setLoaded(true)}
          className={`max-h-[85vh] max-w-[90vw] rounded-lg object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "h-0 w-0 opacity-0"
          }`}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {currentIndex < images.length - 1 && (
        <button
          className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-4"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

const galleryYears = ["2023-24", "2024-25", "2022-23", "2021-22"];

const outdoorGames2324Images = [
  "/gallery/outdoor-games-2023-24/kva-outdoor-games-23-24.png",
  "/gallery/outdoor-games-2023-24/img20240121082344.jpg",
  "/gallery/outdoor-games-2023-24/img20240121083540.jpg",
  "/gallery/outdoor-games-2023-24/img20240121083614.jpg",
  "/gallery/outdoor-games-2023-24/img20240121091003.jpg",
  "/gallery/outdoor-games-2023-24/img20240121091242.jpg",
  "/gallery/outdoor-games-2023-24/img20240121092017.jpg",
  "/gallery/outdoor-games-2023-24/img20240121092920.jpg",
  "/gallery/outdoor-games-2023-24/img20240121092949.jpg",
  "/gallery/outdoor-games-2023-24/img20240121093017.jpg",
  "/gallery/outdoor-games-2023-24/img20240121093102.jpg",
  "/gallery/outdoor-games-2023-24/img20240121093216.jpg",
  "/gallery/outdoor-games-2023-24/img20240121093351.jpg",
  "/gallery/outdoor-games-2023-24/img20240121093804.jpg",
  "/gallery/outdoor-games-2023-24/img20240121094137.jpg",
  "/gallery/outdoor-games-2023-24/img20240121094648.jpg",
  "/gallery/outdoor-games-2023-24/img20240121094826.jpg",
  "/gallery/outdoor-games-2023-24/img20240121150033.jpg",
  "/gallery/outdoor-games-2023-24/img20240121155626.jpg",
  "/gallery/outdoor-games-2023-24/img20240121164613.jpg",
  "/gallery/outdoor-games-2023-24/img20240121165545.jpg",
  "/gallery/outdoor-games-2023-24/img20240121165615.jpg",
  "/gallery/outdoor-games-2023-24/img20240121165654_01.jpg",
  "/gallery/outdoor-games-2023-24/img20240121165723.jpg",
  "/gallery/outdoor-games-2023-24/img20240121180638.jpg",
  "/gallery/outdoor-games-2023-24/img20240121180640.jpg",
  "/gallery/outdoor-games-2023-24/img20240121194430.jpg",
  "/gallery/outdoor-games-2023-24/img20240121194838.jpg",
  "/gallery/outdoor-games-2023-24/img20240121194853.jpg",
  "/gallery/outdoor-games-2023-24/img20240121194915.jpg",
  "/gallery/outdoor-games-2023-24/img20240120221229.jpg",
  "/gallery/outdoor-games-2023-24/img-20240107-wa0010.jpg",
  "/gallery/outdoor-games-2023-24/img-20240110-wa0024.jpg",
  "/gallery/outdoor-games-2023-24/img-20240122-wa0018.jpg",
  "/gallery/outdoor-games-2023-24/img-20240122-wa0019.jpg",
  "/gallery/outdoor-games-2023-24/10830628_796307163776023_3970487109183953045_o.jpg",
  "/gallery/outdoor-games-2023-24/12241004_967695146637223_7668654274511906035_o.jpg",
  "/gallery/outdoor-games-2023-24/386970_221690221237723_1051815024_n.jpg",
  "/gallery/outdoor-games-2023-24/392154_221689351237810_333882535_n.jpg",
  "/gallery/outdoor-games-2023-24/screenshot_2024-01-10-18-38-47-56_a23b203fd3aafc6dcb84e438dda678b6.jpg",
  "/gallery/outdoor-games-2023-24/screenshot_2024-01-10-18-39-07-72_a23b203fd3aafc6dcb84e438dda678b6.jpg",
  "/gallery/outdoor-games-2023-24/screenshot_2024-01-10-18-39-52-47_a23b203fd3aafc6dcb84e438dda678b6.jpg",
  "/gallery/outdoor-games-2023-24/screenshot_2024-01-10-20-27-44-05_a23b203fd3aafc6dcb84e438dda678b6.jpg",
];

const ANNIVERSARY_80_TITLE = "80th Anniversary Celebration";
const ANNIVERSARY_LOGO = "/gallery/80th-anniversary-2026/80th-anniversary-logo.png";

const anniversary80Album: GalleryAlbum = {
  year: "Milestone",
  title: ANNIVERSARY_80_TITLE,
  icon: "✨",
  cover: ANNIVERSARY_LOGO,
  images: anniversary80Data.images,
};

const albums: GalleryAlbum[] = [
  {
    year: "2023-24",
    title: "Outdoor Games 2023-24",
    icon: "🏏",
    cover: "/gallery/outdoor-games-2023-24/kva-outdoor-games-23-24.png",
    images: outdoorGames2324Images,
  },
];

function isAnniversary80Album(album: GalleryAlbum | null): boolean {
  return album?.title === ANNIVERSARY_80_TITLE;
}

type LightboxState = { images: string[]; index: number };

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState("2023-24");
  const [openAlbum, setOpenAlbum] = useState<GalleryAlbum | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [videoModalSrc, setVideoModalSrc] = useState<string | null>(null);

  const filtered = albums.filter((a) => a.year === selectedYear);

  const anniversaryMediaCount =
    anniversary80Data.images.length + (anniversary80Data.video ? 1 : 0);

  useEffect(() => {
    setLightbox(null);
    setVideoModalSrc(null);
  }, [openAlbum]);

  const handleLightboxNavigate = useCallback((index: number) => {
    setLightbox((prev) => (prev ? { ...prev, index } : null));
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <div
      className="mx-auto max-w-6xl overflow-x-hidden py-12"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-kva-text">
          Photo <span className="text-primary">Gallery</span>
        </h1>
        <p className="mt-2 text-kva-text-light">
          Memories from KVA events and celebrations
        </p>
      </div>

      {/* Milestone: 80th Anniversary — featured above year-wise albums */}
      {!openAlbum && (
        <button
          type="button"
          onClick={() => setOpenAlbum(anniversary80Album)}
          className="group relative mb-10 w-full overflow-hidden rounded-3xl border border-amber-600/25 bg-gradient-to-br from-amber-950 via-[#4a0a0a] to-black text-left shadow-xl transition-all hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-red-600/15 blur-2xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[8rem] font-bold leading-none text-white/[0.04] transition-colors group-hover:text-amber-100/[0.07] sm:text-[10rem] md:right-10"
            aria-hidden
          >
            80
          </span>
          <div className="relative flex flex-col items-stretch gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 md:p-10">
            <div className="relative mx-auto flex-shrink-0 sm:mx-0">
              <div className="absolute inset-0 scale-110 rounded-full bg-amber-400/20 blur-2xl" />
              <div className="relative rounded-full bg-black/50 p-3 ring-2 ring-amber-500/40 ring-offset-4 ring-offset-amber-950/50 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src={ANNIVERSARY_LOGO}
                  alt="KVA 80th Anniversary emblem"
                  width={200}
                  height={200}
                  className="h-40 w-40 rounded-full object-contain sm:h-44 sm:w-44 md:h-52 md:w-52"
                  priority
                />
              </div>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-amber-50 sm:text-3xl md:text-4xl">
                80th Anniversary Celebration
              </h2>
              <p className="mt-2 text-sm text-amber-100/75 sm:text-base">
                The Karnataka Vishwakarma Association (Regd.), Mumbai
              </p>
              <p className="mt-1 font-medium text-amber-300">
                4 January 2026 · Mumbai
              </p>
              {anniversaryMediaCount > 0 && (
                <p className="mt-2 text-xs text-amber-200/80">
                  {anniversary80Data.images.length} photo
                  {anniversary80Data.images.length === 1 ? "" : "s"}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-amber-950 shadow-lg transition-transform group-hover:translate-x-0.5">
                View celebration gallery
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Year Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {galleryYears.map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
              setOpenAlbum(null);
            }}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              selectedYear === year
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-kva-text-light hover:bg-gray-200"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {openAlbum ? (
        <>
          <div className="mb-6 flex min-w-0 flex-wrap items-center gap-2 gap-y-1 sm:gap-3">
            <button
              onClick={() => setOpenAlbum(null)}
              className="flex flex-shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-kva-text-light transition-colors hover:bg-gray-100 sm:px-3 sm:py-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
            <h2 className="min-w-0 flex-1 text-sm font-bold leading-tight text-kva-text break-words sm:text-xl">
              {openAlbum.icon} {openAlbum.title}
            </h2>
            <span className="flex-shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-dark sm:px-3 sm:text-sm">
              {isAnniversary80Album(openAlbum)
                ? anniversaryMediaCount > 0
                  ? `${anniversaryMediaCount} in gallery`
                  : "Gallery"
                : openAlbum.images.length > 0
                  ? `${openAlbum.images.length} photos`
                  : "Gallery"}
            </span>
          </div>

          {isAnniversary80Album(openAlbum) ? (
            <AnniversaryMixedGrid
              images={anniversary80Data.images}
              video={anniversary80Data.video}
              videoPosition={anniversary80Data.videoPosition}
              onImageClick={(index) =>
                setLightbox({
                  images: anniversary80Data.images,
                  index,
                })
              }
              onVideoExpand={() => {
                if (anniversary80Data.video)
                  setVideoModalSrc(anniversary80Data.video);
              }}
            />
          ) : (
            <AlbumGrid
              album={openAlbum}
              onImageClick={(index) =>
                setLightbox({ images: openAlbum.images, index })
              }
            />
          )}

          {lightbox !== null && (
            <Lightbox
              images={lightbox.images}
              currentIndex={lightbox.index}
              onClose={handleLightboxClose}
              onNavigate={handleLightboxNavigate}
            />
          )}

          {videoModalSrc !== null && (
            <VideoExpandModal
              src={videoModalSrc}
              onClose={() => setVideoModalSrc(null)}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((album, index) => (
              <div
                key={index}
                onClick={() => album.images.length > 0 && setOpenAlbum(album)}
                className={`group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  album.images.length > 0
                    ? "cursor-pointer"
                    : "cursor-default opacity-60"
                }`}
              >
                {album.cover ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={album.cover}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-0.5 text-xs font-semibold text-primary-dark">
                      {album.images.length} photos
                    </span>
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-kva-bg-alt text-6xl transition-transform group-hover:scale-110">
                    {album.icon}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-kva-text">{album.title}</h3>
                  <p className="mt-1 text-sm text-kva-text-light">
                    {album.images.length > 0
                      ? `${album.images.length} photos — tap to view`
                      : "Coming soon"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-kva-text-light">
              No gallery items for this year yet.
            </div>
          )}
        </>
      )}

      <div className="mt-10 rounded-2xl bg-kva-bg-alt p-8 text-center">
        <p className="text-kva-text-light">
          📸 Have photos from KVA events? Share them with us at{" "}
          <span className="font-semibold text-primary-dark">
            kvamumbai1962@gmail.com
          </span>
        </p>
      </div>
    </div>
  );
}
