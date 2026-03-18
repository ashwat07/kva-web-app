"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Events", href: "/events", icon: "📅" },
  { label: "Committee", href: "/committee", icon: "👥" },
  { label: "Gallery", href: "/gallery", icon: "🖼️" },
  { label: "History", href: "/history", icon: "📋" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "max(0.5rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(0.5rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2.5 pt-3 transition-colors ${
                isActive
                  ? "text-primary-dark"
                  : "text-kva-text-light active:bg-gray-100"
              }`}
            >
              <span className="text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary-dark" : "text-kva-text-light"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
