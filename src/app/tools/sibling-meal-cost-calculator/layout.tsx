import type { ReactNode } from "react";

export const metadata = {
  title: "Sibling Meal Cost Calculator — Baby & Toddler Subscription Pricing | Sibling Stack",
  description:
    "Estimate combined monthly baby and toddler meal subscription costs across Little Spoon, Once Upon a Farm, Tiny Organics, Nurture Life, and Cerebelly. Free, no login, no tracking required.",
  alternates: { canonical: "/tools/sibling-meal-cost-calculator" },
  openGraph: {
    title: "Sibling Meal Cost Calculator — Baby & Toddler Subscription Pricing | Sibling Stack",
    description:
      "Estimate combined monthly baby and toddler meal subscription costs across Little Spoon, Once Upon a Farm, Tiny Organics, Nurture Life, and Cerebelly. Free, no login, no tracking required.",
    url: "https://www.siblingstack.com/tools/sibling-meal-cost-calculator",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function SiblingMealCostCalculatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
