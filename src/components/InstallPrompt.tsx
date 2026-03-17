"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "kva-install-prompt-dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<{
    prompt: () => Promise<{ outcome: string }>;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // iOS: no beforeinstallprompt, show manual instructions
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints > 2;
    setIsIOS(ios);

    if (ios) {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
      return;
    }

    // Chrome/Edge: capture install prompt and show our UI
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as { prompt: () => Promise<{ outcome: string }> });
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  const handleDismiss = () => {
    setVisible(false);
    if (isIOS) sessionStorage.setItem(DISMISS_KEY, "true");
    else localStorage.setItem(DISMISS_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md md:bottom-6 md:left-auto md:right-6"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-white p-4 shadow-xl">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-kva-text">
            {isIOS ? "Add to Home Screen" : "Install KVA App"}
          </p>
          <p className="mt-0.5 text-xs text-kva-text-light">
            {isIOS
              ? "Tap Share (↑) then \"Add to Home Screen\" for quick access."
              : "Get the app on your device for a better experience."}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="rounded-full p-2 text-kva-text-light transition-colors hover:bg-gray-100 hover:text-kva-text"
            aria-label="Dismiss"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
