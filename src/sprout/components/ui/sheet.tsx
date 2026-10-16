"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/sprout/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableWithin(node: HTMLElement | null): HTMLElement[] {
  if (!node) return [];
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const subtitleId = useId();
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep keyboard focus inside the dialog.
      const items = focusableWithin(dialogRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog once it is mounted.
    const frame = window.requestAnimationFrame(() => {
      const items = focusableWithin(dialogRef.current);
      (items[0] ?? dialogRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  // Follow the visual viewport so an open keyboard never covers the form
  // (the dialog stays bottom-anchored, its height is what shrinks).
  useEffect(() => {
    if (!open || typeof window === "undefined" || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const apply = () => setViewportHeight(Math.round(viewport.height));
    apply();
    viewport.addEventListener("resize", apply);
    viewport.addEventListener("scroll", apply);
    return () => {
      viewport.removeEventListener("resize", apply);
      viewport.removeEventListener("scroll", apply);
    };
  }, [open]);

  if (!open) return null;

  const maxHeight = viewportHeight
    ? `min(92dvh, ${Math.max(240, viewportHeight - 8)}px)`
    : "92dvh";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        style={{ maxHeight }}
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-t-4xl border border-hairline bg-sprout-surface shadow-lift animate-slide-up outline-none sm:rounded-4xl",
          maxWidth,
        )}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
          {icon}
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-serif truncate text-lg font-bold text-foreground"
            >
              {title}
            </h2>
            {subtitle ? (
              <p id={subtitleId} className="truncate text-xs font-medium text-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-sprout-surface-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="thin-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-hairline bg-sprout-surface px-5 py-4 pb-safe">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
