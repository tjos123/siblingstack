import Link from "next/link";

export const metadata = {
  title: "Free Tools — Sibling Stack",
  description:
    "Free calculators and interactive tools for parents managing two kids close in age. Wake windows, nap syncing, and bedtime order — no login required.",
  alternates: {
    canonical: "https://www.siblingstack.com/tools",
  },
  openGraph: {
    title: "Free Tools — Sibling Stack",
    description:
      "Free calculators and interactive tools for parents managing two kids close in age.",
    url: "https://www.siblingstack.com/tools",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

const tools = [
  {
    slug: "calculator",
    title: "Wake window calculator",
    description:
      "Enter your baby's age and wake time to find the recommended time for their next nap — so you can put them down before overtiredness sets in.",
  },
  {
    slug: "nap-sync-calculator",
    title: "Sibling nap sync calculator",
    description:
      "Find out when both of your children will nap at the exact same time so you can get a guaranteed afternoon break.",
  },
  {
    slug: "bedtime-stagger-calculator",
    title: "Bedtime stagger calculator",
    description:
      "Never put both kids down at the exact same minute. Answer two simple questions to know which child to put to sleep first tonight.",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Home
            </Link>
            <span className="text-surface2">›</span>
            <span className="text-ink-muted">Tools</span>
          </nav>

          <h1 className="font-display text-3xl text-ink mt-5 mb-2">
            Free tools
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Calculators and interactive tools for parents managing two kids close
            in age. No login required.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="block group"
            >
              <article className="border border-surface2 rounded-xl p-6 hover:border-childA transition-colors">
                <h2 className="font-display text-lg text-ink leading-snug mb-2 group-hover:text-childA transition-colors">
                  {tool.title}
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
                <span className="text-sm font-medium text-childA mt-4 inline-flex items-center gap-1.5 transition-all group-hover:gap-2.5">
                  Open tool →
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-surface2">
          <p className="font-display text-lg text-ink mb-3">Want live tracking?</p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-lg mb-5">
            These calculators give you a snapshot. Sibling Stack tracks both kids&apos;
            patterns in real time and surfaces conflicts before they happen.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
          >
            Create your account
          </Link>
        </div>
      </div>
    </main>
  );
}
