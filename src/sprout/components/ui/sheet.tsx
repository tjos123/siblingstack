"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/sprout/lib/utils";

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
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-4xl border border-hairline bg-sprout-surface shadow-lift animate-slide-up sm:rounded-4xl",
          maxWidth,
        )}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
          {icon}
          <div className="min-w-0 flex-1">
            <h2 className="font-serif truncate text-lg font-bold text-foreground">
              {title}
            </h2>
            {subtitle ? (
              <p className="truncate text-xs font-medium text-muted">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-sprout-surface-muted hover:text-foreground"
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
