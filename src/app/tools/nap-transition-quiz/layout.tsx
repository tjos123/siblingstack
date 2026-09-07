import type { ReactNode } from "react";

export const metadata = {
  title: "Is My Toddler Ready to Drop a Nap? — Free Quiz | Sibling Stack",
  description:
    "Answer 5 quick questions about your toddler's nap resistance and daily mood to find out if they're ready to drop to one nap — or one nap to none.",
  alternates: { canonical: "/tools/nap-transition-quiz" },
  openGraph: {
    title: "Is My Toddler Ready to Drop a Nap? — Free Quiz | Sibling Stack",
    description:
      "Answer 5 quick questions about your toddler's nap resistance and daily mood to find out if they're ready to drop to one nap — or one nap to none.",
    url: "https://www.siblingstack.com/tools/nap-transition-quiz",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function NapTransitionQuizLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}