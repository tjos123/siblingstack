import Link from "next/link";
import { REVIEW_CLUSTERS, REVIEW_SLUGS_BY_CLUSTER } from "@/lib/blog";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Reviews — Sibling Stack",
  description:
    "In-depth reviews and buying guides for two-kid households: Lovevery play kits, baby and toddler meal subscriptions, diaper delivery, and gear that actually works for two kids close in age.",
  alternates: { canonical: "https://www.siblingstack.com/reviews" },
  openGraph: {
    title: "Reviews — Sibling Stack",
    description:
      "In-depth reviews and buying guides for two-kid households: Lovevery play kits, baby and toddler meal subscriptions, diaper delivery, and gear that actually works for two kids close in age.",
    url: "https://www.siblingstack.com/reviews",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

export default function ReviewsPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <SiteHeader />
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Sibling Stack
            </Link>
            <span className="text-surface2">›</span>
            <span className="text-ink-muted">Reviews</span>
          </nav>

          <h1 className="font-display text-3xl text-ink mt-5 mb-4">
            Reviews Built Around Two Kids Close in Age
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Most review sites assume you&apos;re buying for a single baby. These
            reviews flip that assumption: every cluster below is built around the
            questions a two-under-two household actually asks — will it pass down,
            does it survive two stages at once, is the subscription math different
            when volume doubles.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {REVIEW_CLUSTERS.map((cluster) => {
            const count = REVIEW_SLUGS_BY_CLUSTER[cluster.slug].length;
            return (
              <Link key={cluster.slug} href={`/reviews/${cluster.slug}`} className="block group">
                <article
                  className="rounded-xl p-6 border border-surface2 bg-surface1/60 transition-all hover:border-childA hover:bg-surface1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span aria-hidden="true" className="text-xl">
                      {cluster.emoji}
                    </span>
                    <h2 className="font-display text-xl text-ink group-hover:text-childA transition-colors">
                      {cluster.label}
                    </h2>
                    <span className="text-ink-muted text-xs font-mono">
                      · {count} guides
                    </span>
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    {cluster.blurb}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}