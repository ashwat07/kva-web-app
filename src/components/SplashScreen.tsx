"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const LINE_1 = "| Śrī Kalikamba Prasanna |";
const LINE_2 = "| Namoḥ Viśhwakarmaṇe |";

function RevealText({
  text,
  startMs,
  charDelayMs,
  onComplete,
}: {
  text: string;
  startMs: number;
  charDelayMs: number;
  onComplete?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
      setVisibleCount(1);
    }, startMs);
    return () => clearTimeout(startTimer);
  }, [startMs]);

  useEffect(() => {
    if (!started) return;
    if (visibleCount >= text.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), charDelayMs);
    return () => clearTimeout(t);
  }, [started, visibleCount, text.length, charDelayMs, onComplete]);

  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300"
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? "translateY(0)" : "translateY(0.25em)",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFadeOut(true), 4200);
    const finishTimer = setTimeout(() => onFinish(), 4700);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  // Start both when the loading bar has finished sliding in (~0.6s), so they begin together
  const animationStartMs = 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${fadeOut ? "animate-fade-out" : ""}`}
      style={{
        background: "linear-gradient(135deg, #D4920B 0%, #B37A09 50%, #8B6914 100%)",
        paddingTop: "env(safe-area-inset-top, 0)",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        paddingLeft: "env(safe-area-inset-left, 0)",
        paddingRight: "env(safe-area-inset-right, 0)",
      }}
    >
      <div className="animate-scale-up flex flex-col items-center px-4">
        <div className="relative h-40 w-40 md:h-52 md:w-52">
          <Image
            src="/kva-logo.png"
            alt="KVA Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="animate-slide-up mt-6 text-center" style={{ animationDelay: "0.4s" }}>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            The Karnataka Vishwakarma
          </h1>
          <h2 className="text-lg font-semibold text-white/90 md:text-xl">
            Association (Regd.), Mumbai
          </h2>
          <p className="mt-2 text-sm text-white/70">Est. 1945</p>
        </div>
      </div>

      {/* Sacred lines + loading bar run in parallel from same start */}
      <div
        className="absolute left-4 right-4 flex flex-col items-center justify-center gap-2 text-center"
        style={{
          bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <p className="font-medium tracking-wide text-white/95 drop-shadow-sm min-h-[1.5em] text-base md:text-lg">
          <RevealText text={LINE_1} startMs={animationStartMs} charDelayMs={85} />
        </p>
        <p className="font-medium tracking-wide text-white/95 drop-shadow-sm min-h-[1.5em] text-base md:text-lg">
          <RevealText text={LINE_2} startMs={animationStartMs + 1850} charDelayMs={90} />
        </p>
      </div>

      {/* Loading bar — starts immediately with text */}
      <div
        className="absolute animate-slide-up"
        style={{
          bottom: "calc(3rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{
              animation: "splash-loading 3.5s ease-in-out forwards",
              animationDelay: `${animationStartMs}ms`,
            }}
          />
        </div>
        <style>{`
          @keyframes splash-loading {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
