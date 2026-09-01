import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-surface2">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="font-display text-lg text-ink whitespace-nowrap">
          Sibling Stack
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link href="/irish-twins-guide" className="text-ink-muted hover:text-ink transition-colors">
            Guides
          </Link>
          <Link href="/schedules" className="text-ink-muted hover:text-ink transition-colors">
            Schedule App
          </Link>
          <Link href="/tools" className="text-ink-muted hover:text-ink transition-colors">
            Calculators
          </Link>
          <Link
            href="/sign-up"
            className="hidden sm:inline-block bg-childA text-bg font-medium rounded-md py-2 px-4 text-sm hover:opacity-90 transition-opacity"
          >
            Get started free
          </Link>
        </nav>
      </div>
    </header>
  );
}