import Link from "next/link";
import { posts, CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/blog";
import type { PostMeta } from "@/lib/blog";

export const metadata = {
  title: "Blog — Sibling Stack",
  description:
    "Practical guides, gear roundups, and schedule advice for parents with two kids close in age.",
  alternates: { canonical: "https://siblingstack.com/blog" },
  openGraph: {
    title: "Blog — Sibling Stack",
    description:
      "Practical guides, gear roundups, and schedule advice for parents with two kids close in age.",
    url: "https://siblingstack.com/blog",
    siteName: "Sibling Stack",
    locale: "en_US",
    type: "website",
  },
};

function ReadTime({ minutes }: { minutes: number }) {
  return (
    <span className="font-mono text-xs text-ink-muted">
      {minutes} min read
    </span>
  );
}

function CategoryPill({ category }: { category: PostMeta["category"] }) {
  const color = CATEGORY_COLOR[category];
  return (
    <span
      className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}

function FeaturedCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className="rounded-xl p-7 border transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #25201a 0%, #1e1a15 100%)",
          borderColor: `${CATEGORY_COLOR[post.category]}35`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <CategoryPill category={post.category} />
          <ReadTime minutes={post.readingTimeMinutes} />
        </div>

        <h2
          className="font-display text-2xl text-ink leading-snug mb-3 group-hover:text-childA transition-colors"
          style={{ maxWidth: "40ch" }}
        >
          {post.title}
        </h2>

        <p className="text-ink-muted leading-relaxed mb-5" style={{ maxWidth: "55ch" }}>
          {post.description}
        </p>

        <span
          className="text-sm font-medium inline-flex items-center gap-1.5 transition-all group-hover:gap-2.5"
          style={{ color: CATEGORY_COLOR[post.category] }}
        >
          Read article →
        </span>
      </article>
    </Link>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  const accentColor = CATEGORY_COLOR[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className="flex gap-5 py-5 border-b border-surface2 last:border-0 transition-all"
      >
        <div
          className="w-1 rounded-full shrink-0 self-stretch opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor, minHeight: "3rem" }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <CategoryPill category={post.category} />
            <ReadTime minutes={post.readingTimeMinutes} />
          </div>

          <h2 className="font-display text-lg text-ink leading-snug mb-1.5 group-hover:text-childA transition-colors">
            {post.title}
          </h2>

          <p className="text-ink-muted text-sm leading-relaxed line-clamp-2">
            {post.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-ink-muted text-sm underline">
            ← Sibling Stack
          </Link>
          <h1 className="font-display text-3xl text-ink mt-5 mb-2">
            Two kids, close together.
          </h1>
          <p className="text-ink-muted leading-relaxed">
            Practical guides for parents whose kids are close enough in age
            that their schedules, gear, and routines all overlap at once.
          </p>
          <p className="text-ink-muted text-sm leading-relaxed mt-4">
            If you have two kids close in age, most parenting advice assumes
            you're managing one baby at a time. These articles cover the
            situations that general guides don't address — from double strollers
            that fit two different-sized kids to nap schedules that actually work
            when one child is a newborn and the other is a toddler.
          </p>
        </div>

        {featured && (
          <div className="mb-8">
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-3">
              Start here
            </p>
            <FeaturedCard post={featured} />
          </div>
        )}

        {rest.length > 0 && (
          <div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-1">
              More articles
            </p>
            <div>
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-surface2">
          <p className="font-display text-lg text-ink mb-3">About this blog</p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-lg">
            Sibling Stack is built by parents who live the two-kids-close-in-age
            reality every day. Every guide, roundup, and schedule tip on this
            blog comes from real experience — tested with our own kids, updated
            as they grow, and written for the specific chaos of overlapping sleep
            windows and shared gear decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
