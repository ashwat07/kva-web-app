"use client";

import { useState, useEffect } from "react";

export default function NotificationManager() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;

    // Show banner if permission not yet granted and not dismissed
    if (
      Notification.permission === "default" &&
      !sessionStorage.getItem("notification-dismissed")
    ) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    const result = await Notification.requestPermission();
    setShowBanner(false);

    if (result === "granted") {
      // Show a welcome notification
      new Notification("KVA Mumbai", {
        body: "You'll now receive updates on events, meetings & announcements!",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
      });
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("notification-dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up rounded-2xl border border-primary/20 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
          🔔
        </span>
        <div className="flex-1">
          <h4 className="font-semibold text-kva-text">Stay Updated!</h4>
          <p className="mt-0.5 text-sm text-kva-text-light">
            Get notified about KVA events, committee meetings &amp; shradhanjali announcements.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={requestPermission}
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Allow Notifications
            </button>
            <button
              onClick={dismiss}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-kva-text-light transition-colors hover:bg-gray-100"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Utility to send a local notification (call from anywhere in the app).
 * For scheduled notifications, use this with setTimeout or date checks.
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  return new Notification(title, {
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    ...options,
  });
}

/**
 * Schedule a notification for upcoming events.
 * In a real app, this would be handled server-side with Web Push API.
 * For static PWA, we check events on page load and notify if within 24hrs.
 */
export function checkUpcomingEvents() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const events = [
    { date: "2026-05-31", title: "Career Counseling & Vidyadanam Books Distribution" },
    { date: "2026-06-21", title: "Yoga Day / Health Camp & Blood Donation" },
    { date: "2026-07-05", title: "Badminton Tournament" },
    { date: "2026-08-23", title: "KVAFL Season 2 - Football Tournament" },
    { date: "2026-09-17", title: "Shri Vishwakarma Pooja 2026" },
    { date: "2026-10-24", title: "Garba Night" },
    { date: "2026-11-15", title: "Indoor Games" },
    { date: "2026-12-06", title: "Outdoor Sports Event" },
    { date: "2027-01-10", title: "KVA Picnic" },
    { date: "2027-03-28", title: "Ugadi Celebration" },
  ];

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (eventDate >= now && eventDate <= tomorrow) {
      const notifKey = `notified-${event.date}`;
      if (!localStorage.getItem(notifKey)) {
        sendNotification("KVA Event Reminder", {
          body: `Tomorrow: ${event.title}`,
          tag: event.date,
        });
        localStorage.setItem(notifKey, "true");
      }
    }
  });
}
