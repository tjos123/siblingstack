import type { ReactNode } from "react";

export const metadata = {
  title:
    "Bedtime Stagger Calculator — Which Kid to Put Down First | Sibling Stack",
  description:
    "Answer two quick questions about each child's fatigue level to find out which sibling to put to bed first tonight. Free, no login.",
  alternates: { canonical: "/tools/bedtime-stagger-calculator" },
  openGraph: {
    title:
      "Bedtime Stagger Calculator — Which Kid to Put Down First | Sibling Stack",
    description:
      "Answer two quick questions about each child's fatigue level to find out which sibling to put to bed first tonight.",
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