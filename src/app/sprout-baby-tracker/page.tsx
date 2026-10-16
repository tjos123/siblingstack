import { SproutApp } from "@/sprout/components/app-shell";
import { SproutLanding } from "@/sprout/components/sprout-landing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sprout Baby Tracker",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, Android",
  url: "https://www.siblingstack.com/sprout-baby-tracker",
  description:
    "A calm, private baby tracker for feeds, sleep, diapers, growth and milestones. Works fully offline and installs to your home screen — no account required.",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Feed, sleep and diaper tracking",
    "Growth and milestone logging",
    "Works offline",
    "Private — data stays on your device",
  ],
};

export default function SproutBabyTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.sprout-landing{display:block}</style>",
        }}
      />
      <SproutLanding />
      <div id="sprout-app">
        <SproutApp />
      </div>
    </>
  );
}
