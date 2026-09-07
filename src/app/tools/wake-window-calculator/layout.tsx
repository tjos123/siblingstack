import type { ReactNode } from "react";

export const metadata = {
  title: "Wake Window Calculator — Free Baby Nap Timing Tool | Sibling Stack",
  description:
    "Enter your baby's age and wake time to get their next recommended nap window. Free, no login, no tracking required.",
  alternates: { canonical: "/tools/wake-window-calculator" },
  openGraph: {
    title: "Wake Window Calculator — Free Baby Nap Timing Tool | Sibling Stack",
    description:
      "Enter your baby's age and wake time to get their next recommended nap window. Free, no login, no tracking required.",
    url: "https://www.siblingstack.com/tools/wake-window-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}