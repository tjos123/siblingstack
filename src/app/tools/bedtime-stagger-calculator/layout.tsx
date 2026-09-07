import type { ReactNode } from "react";

export const metadata = {
  title: "Bedtime Stagger Calculator — Sibling Stack",
  description:
    "Never put both kids down at the exact same minute. Answer two simple questions to know which child to put to sleep first tonight.",
  alternates: { canonical: "/tools/bedtime-stagger-calculator" },
  openGraph: {
    title: "Bedtime Stagger Calculator — Sibling Stack",
    description:
      "Answer two simple questions to know which child to put to sleep first tonight.",
    url: "https://www.siblingstack.com/tools/bedtime-stagger-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function BedtimeStaggerCalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}