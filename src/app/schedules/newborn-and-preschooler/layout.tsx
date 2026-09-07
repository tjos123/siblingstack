import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newborn + Preschooler Schedule — Free Sample Routines | Sibling Stack",
  description:
    "A newborn + preschooler schedule doesn't have an overlap to find — so how do you make the days work? Free sample routines for when your preschooler is home all day or in school part-time.",
  openGraph: {
    title: "Newborn + Preschooler Schedule — Sibling Stack",
    description:
      "Free sample routines (home all day or school/daycare) plus the rest-time, reunion-window, and regression essentials for a newborn + preschooler age gap.",
    url: "https://www.siblingstack.com/schedules/newborn-and-preschooler",
    siteName: "Sibling Stack",
    type: "website",
  },
  alternates: {
    canonical: "https://www.siblingstack.com/schedules/newborn-and-preschooler",
  },
};

export default function NewbornAndPreschoolerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}