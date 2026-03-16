"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2200);
    const finishTimer = setTimeout(() => onFinish(), 2700);
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

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
            Karnataka Vishwakarma
          </h1>
          <h2 className="text-lg font-semibold text-white/90 md:text-xl">
            Association, Mumbai
          </h2>
          <p className="mt-2 text-sm text-white/70">Est. 1945</p>
        </div>
      </div>
      <div
        className="absolute animate-slide-up"
        style={{
          animationDelay: "0.8s",
          bottom: "calc(3rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white"
            style={{
              animation: "loading 2s ease-in-out forwards",
            }}
          />
        </div>
        <style>{`
          @keyframes loading {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
