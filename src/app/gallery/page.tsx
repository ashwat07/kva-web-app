"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import galleryManifest from "@/data/gallery-manifest.json";

const BATCH_SIZE = 16;

const manifest = galleryManifest as Record<string, { w: number; h: number }>;

function getThumbSrc(src: string): string {
  const lastSlash = src.lastIndexOf("/");
  if (lastSlash === -1) return src;
  const dir = src.substring(0, lastSlash);
  const file = src.substring(lastSlash + 1);
  const ext = file.lastIndexOf(".");
  const name = ext !== -1 ? file.substring(0, ext) : file;
  return `${dir}/thumbs/${name}.jpg`;
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
      <button
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
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

const albums: GalleryAlbum[] = [
  {
    year: "2023-24",
    title: "Outdoor Games 2023-24",
    icon: "🏏",
    cover: "/gallery/outdoor-games-2023-24/kva-outdoor-games-23-24.png",
    images: outdoorGames2324Images,
  },
  
];

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState("2023-24");
  const [openAlbum, setOpenAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = albums.filter((a) => a.year === selectedYear);

  const handleLightboxNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <div
      className="mx-auto max-w-6xl py-12"
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
              {openAlbum.images.length} photos
            </span>
          </div>

          <AlbumGrid
            album={openAlbum}
            onImageClick={(index) => setLightboxIndex(index)}
          />

          {lightboxIndex !== null && (
            <Lightbox
              images={openAlbum.images}
              currentIndex={lightboxIndex}
              onClose={handleLightboxClose}
              onNavigate={handleLightboxNavigate}
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
