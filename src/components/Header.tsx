"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "History", href: "/history" },
  { label: "Committee", href: "/committee" },
  { label: "Events", href: "/events" },
  { label: "KVA Feed", href: "/feed" },
  { label: "Samvadi", href: "/samvadi" },
  { label: "Matrimony", href: "/matrimony" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-white/95 shadow-sm backdrop-blur-md">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between py-2"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingTop: "env(safe-area-inset-top, 0)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-15 w-15 flex-shrink-0 overflow-hidden rounded-xl">
            <Image
              src="/kva-logo.png"
              alt="KVA Logo"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-kva-text leading-tight">The Karnataka Vishwakarma</p>
            <p className="text-xs text-kva-text-light">Association (Regd.), Mumbai</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-kva-text transition-colors hover:bg-primary/10 hover:text-primary-dark ${currentPath === item.href ? 'bg-primary/10 text-primary-dark': ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-lg p-2 text-kva-text hover:bg-primary/10"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-primary/10 bg-white px-4 py-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-kva-text transition-colors hover:bg-primary/10 hover:text-primary-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
