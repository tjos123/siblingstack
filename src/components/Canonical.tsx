"use client";

import { useEffect } from "react";

export default function Canonical({ url }: { url: string }) {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [url]);
  return null;
}
