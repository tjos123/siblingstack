import type { ReactNode } from "react";

export const metadata = {
  title:
    "Feeding Schedule Offset Calculator — Sibling Feed Timing Tool | Sibling Stack",
  description:
    "Enter both kids' ages and feeding frequency to get a suggested offset schedule — so you're never doing two simultaneous feeds solo.",
  alternates: { canonical: "/tools/feeding-offset-calculator" },
  openGraph: {
    title:
      "Feeding Schedule Offset Calculator — Sibling Feed Timing Tool | Sibling Stack",
    description:
      "Enter both kids' ages and feeding frequency to get a suggested offset schedule — so you're never doing two simultaneous feeds solo.",
    url: "https://www.siblingstack.com/tools/feeding-offset-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function FeedingOffsetCalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}