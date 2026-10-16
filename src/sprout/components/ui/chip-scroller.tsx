"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/sprout/lib/utils";

// Horizontal chip strip that scroll-snaps and fades its edges only while
// there is more content to scroll to — so nothing is ever clipped silently.
export function ChipScroller({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(max <= 0 || el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-px-4",
          innerClassName,
        )}
      >
        {children}
      </div>
      {!atStart ? (
        <span className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
      ) : null}
      {!atEnd ? (
        <span className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
      ) : null}
    </div>
  );
}
