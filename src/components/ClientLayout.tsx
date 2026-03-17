"use client";

import { useState, useCallback, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import InstallPrompt from "./InstallPrompt";
import NotificationManager, { checkUpcomingEvents } from "./NotificationManager";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Check for upcoming events and send reminders on load
  useEffect(() => {
    if (!showSplash) {
      checkUpcomingEvents();
    }
  }, [showSplash]);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        <Header />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <InstallPrompt />
        <NotificationManager />
      </div>
    </>
  );
}
