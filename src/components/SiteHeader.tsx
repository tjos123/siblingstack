"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/irish-twins-guide", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/schedules", label: "Schedule App" },
  { href: "/tools", label: "Calculators" },
];

export default function SiteHeader() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-surface2">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-lg text-ink whitespace-nowrap">
          Sibling Stack
        </Link>
        <nav className="hidden sm:flex items-center gap-4 sm:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink-muted hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
          {!loading && user ? (
            <Link
              href="/app"
              className="hidden sm:inline-block bg-childA text-bg font-medium rounded-md py-2 px-4 text-sm hover:opacity-90 transition-opacity"
            >
              Open dashboard
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="hidden sm:inline-block bg-childA text-bg font-medium rounded-md py-2 px-4 text-sm hover:opacity-90 transition-opacity"
            >
              Start free
            </Link>
          )}
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="sm:hidden text-ink hover:text-childA transition-colors p-1 -mr-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      </header>

      <div
        className={`fixed inset-0 z-50 sm:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={close}
        />
        <div
          className={`absolute inset-y-0 right-0 w-64 max-w-[80%] bg-surface border-l border-surface2 shadow-2xl shadow-black/70 flex flex-col transition-transform duration-200 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-label="Site navigation"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface2">
            <span className="font-display text-lg text-ink">Sibling Stack</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="text-ink-muted hover:text-ink transition-colors p-1 -mr-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto flex flex-col px-3 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="px-3 py-3.5 text-base rounded-md font-medium text-ink hover:text-childA hover:bg-bg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-5 border-t border-surface2 flex flex-col gap-3">
            {!loading && user ? (
              <Link
                href="/app"
                onClick={close}
                className="text-center bg-childA text-bg font-medium rounded-md py-2.5 text-sm hover:opacity-90 transition-opacity"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  onClick={close}
                  className="text-center bg-childA text-bg font-medium rounded-md py-2.5 text-sm hover:opacity-90 transition-opacity"
                >
                  Start free
                </Link>
                <Link
                  href="/sign-in"
                  onClick={close}
                  className="text-center text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}