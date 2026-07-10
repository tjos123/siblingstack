import type { ReactNode } from "react";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "Sibling Stack",
  description:
    "Track both kids' sleep and feed windows on one timeline. Spot schedule conflicts before they catch you. Built for two kids close in age.",
  alternates: { canonical: "https://siblingstack.com" },
};

export default function Home() {
  return <HomeClient />;
}
