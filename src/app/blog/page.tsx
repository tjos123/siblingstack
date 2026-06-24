import Link from "next/link";
import { posts, CATEGORY_LABEL } from "@/lib/blog";
import type { PostMeta } from "@/lib/blog";

export const metadata = {
  title: "Blog — Sibling Stack",
  description:
    "Practical guides, gear roundups, and schedule advice for parents with two kids close in age.",
};

function isNew(publishedAt: string): boolean {
  const daysSince = (Date.now() - new Date(publishedAt).getTime()) / 86400000;
  return daysSince < 14;
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="border border-surface2 rounded-md p-5 hover:border-childA transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-childA uppercase tracking-wider">
            {CATEGORY_LABEL[post.category]}
          </span>
          {isNew(post.publishedAt) && (
            <span className="text-[10px] font-mono bg-childA text-bg rounded-full px-2 py-0.5 font-medium">
              New
            </span>
          )}
        </div>
        <h2 className="font-display text-lg text-ink mt-1 group-hover:text-childA transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-ink-muted text-sm mt-2 leading-relaxed">
          {post.description}
        </p>
        <p className="text-ink-muted text-xs font-mono mt-3">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-ink-muted text-sm underline">
          ← Sibling Stack
        </Link>

        <h1 className="font-display text-3xl text-ink mt-6 mb-2">
          Two kids, close together.
        </h1>
        <p className="text-ink-muted mb-10">
          Practical guides for parents whose kids are close enough in age
          that their schedules, gear, and routines all overlap at once.
        </p>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
