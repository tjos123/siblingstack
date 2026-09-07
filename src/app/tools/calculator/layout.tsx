import type { ReactNode } from "react";

export const metadata = {
  title: "Wake Window Calculator — Sibling Stack",
  description:
    "Enter your baby's age and wake time to find the recommended next nap time, before overtiredness sets in. Free wake-window ranges from newborn to 24 months.",
  alternates: { canonical: "/tools/calculator" },
  openGraph: {
    title: "Wake Window Calculator — Sibling Stack",
    description:
      "Enter your baby's age and wake time to find the recommended next nap time, before overtiredness sets in.",
    url: "https://www.siblingstack.com/tools/calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}