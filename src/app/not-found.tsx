import Link from "next/link";

export const metadata = { title: "404 — Sibling Stack" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-5xl text-ink mb-3">404</h1>
        <p className="text-ink-muted mb-6">This page doesn't exist.</p>
        <Link
          href="/"
          className="inline-block bg-childA text-bg font-medium rounded-md py-2 px-5 text-sm"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}