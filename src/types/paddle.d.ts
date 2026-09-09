// src/types/paddle.d.ts
//
// Minimal typings for the client-side Paddle.js SDK (loaded from
// https://cdn.paddle.com/paddle/v2/paddle.js at checkout time). Only the
// subset the app uses is declared here.

interface PaddleCheckoutSettings {
  theme?: "light" | "dark";
  successUrl?: string;
  successUrlNetworkDelay?: number;
}

interface PaddleCheckoutOpenOptions {
  settings?: PaddleCheckoutSettings;
  items: { priceId: string; quantity: number }[];
  customData?: Record<string, string | number | boolean>;
}

interface PaddleInstance {
  Environment: {
    set(environment: "sandbox" | "production"): void;
  };
  Initialize(options: { token: string }): Promise<void>;
  Checkout: {
    open(options: PaddleCheckoutOpenOptions): void;
  };
}

interface Window {
  Paddle?: PaddleInstance;
}