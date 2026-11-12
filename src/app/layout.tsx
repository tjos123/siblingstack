import "./globals.css";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/Toast";
import Script from "next/script";

const display = localFont({
  src: "./fonts/fraunces-latin.woff2",
  weight: "400 600",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "./fonts/schibsted-grotesk-latin.woff2",
  weight: "400 600",
  variable: "--font-body",
  display: "swap",
});

const mono = localFont({
  src: [
    {
      path: "./fonts/ibm-plex-mono-400-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ibm-plex-mono-500-latin.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.siblingstack.com"),
  title: "Sibling Stack",
  description: "For parents juggling two kids at overlapping stages.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sibling Stack",
    description: "For parents juggling two kids at overlapping stages.",
    url: "https://www.siblingstack.com",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6TSXWPEf1Q"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6TSXWPEf1Q');`}
      </Script>
      <body className="font-body">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
