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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sibling Nap Sync Calculator",
    url: "https://www.siblingstack.com/tools/nap-sync-calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Find when your two children will nap at the same time, based on both kids' ages and wake time.",
    publisher: {
      "@type": "Organization",
      name: "Sibling Stack",
      url: "https://www.siblingstack.com",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}