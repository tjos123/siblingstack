import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./sprout.css";
import { Providers } from "@/sprout/components/providers";
import { OfflineBanner } from "@/sprout/components/pwa/offline-banner";
import { ServiceWorkerRegistrar } from "@/sprout/components/pwa/service-worker-registrar";
import { SwCleanup } from "@/sprout/components/pwa/sw-cleanup";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sprout Baby Tracker — free, private & offline",
  description:
    "A calm, private baby tracker for feeds, sleep, diapers, growth and milestones. Works fully offline and installs to your home screen — no account required.",
  applicationName: "Sprout Baby",
  keywords: [
    "baby tracker",
    "newborn log",
    "feeding tracker",
    "sleep tracker",
    "diaper log",
    "offline baby app",
    "free baby tracker",
  ],
  openGraph: {
    title: "Sprout Baby Tracker — free, private & offline",
    description:
      "Track feeds, sleep, diapers, growth and milestones in one tap. Private by default, works offline, and installs to your home screen — no account required.",
    url: "/sprout-baby-tracker",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sprout Baby Tracker — free, private & offline",
    description:
      "A calm, private baby tracker for feeds, sleep, diapers, growth and milestones. Works offline and installs to your home screen — no account required.",
  },
  appleWebApp: {
    capable: true,
    title: "Sprout Baby",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false, email: false, address: false },
  manifest: "/sprout-baby-tracker/manifest.webmanifest",
  alternates: { canonical: "/sprout-baby-tracker" },
  icons: {
    icon: [
      {
        url: "/sprout-baby-tracker/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/sprout-baby-tracker/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/sprout-baby-tracker/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#10140e" },
  ],
};

export default function SproutBabyTrackerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={`sprout-root ${playfair.variable} ${jakarta.variable}`}>
      <SwCleanup />
      <OfflineBanner />
      <Providers>{children}</Providers>
      <ServiceWorkerRegistrar />
    </div>
  );
}
