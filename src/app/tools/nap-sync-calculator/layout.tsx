import type { ReactNode } from "react";

export const metadata = {
  title: "Sibling Nap Sync Calculator — Sibling Stack",
  description:
    "Find out when both of your children will nap at the exact same time, so you can get a guaranteed break. Free nap-sync matching for two kids close in age.",
  alternates: { canonical: "/tools/nap-sync-calculator" },
  openGraph: {
    title: "Sibling Nap Sync Calculator — Sibling Stack",
    description:
      "Find out when both of your children will nap at the exact same time, so you can get a guaranteed break.",
    url: "https://www.siblingstack.com/tools/nap-sync-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function NapSyncCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}