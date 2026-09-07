import type { ReactNode } from "react";

export const metadata = {
  title:
    "Sibling Nap Sync Calculator — Find Your Kids' Overlapping Nap Time | Sibling Stack",
  description:
    "Free calculator that finds when your two children will nap at the same time, based on both kids' ages and wake time. No login required.",
  alternates: { canonical: "/tools/nap-sync-calculator" },
  openGraph: {
    title:
      "Sibling Nap Sync Calculator — Find Your Kids' Overlapping Nap Time | Sibling Stack",
    description:
      "Free calculator that finds when your two children will nap at the same time, based on both kids' ages and wake time.",
    url: "https://www.siblingstack.com/tools/nap-sync-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function NapSyncCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}