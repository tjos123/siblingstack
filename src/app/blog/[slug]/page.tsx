import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, CATEGORY_LABEL } from "@/lib/blog";
import EmailCaptureMdx from "@/components/EmailCaptureMdx";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Sibling Stack`,
    description: post.description,
  };
}

// Dynamically imports the MDX file matching the slug. Each MDX file
// in src/content/blog/ is a React component after compilation.
async function loadPost(slug: string) {
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    return mod.default;
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const meta = getPost(params.slug);
  if (!meta) notFound();

  const Content = await loadPost(params.slug);
  if (!Content) notFound();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-ink-muted text-sm underline">
          ← All posts
        </Link>

        <div className="mt-6 mb-8">
          <span className="text-xs font-mono text-childA uppercase tracking-wider">
            {CATEGORY_LABEL[meta.category]}
          </span>
          <h1 className="font-display text-3xl text-ink mt-2 leading-tight">
            {meta.title}
          </h1>
          <p className="text-ink-muted text-xs font-mono mt-2">
            {new Date(meta.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* MDX prose content */}
        <div className="prose-sibling">
          <Content />
        </div>

        {/* Email capture — appears at the bottom of every post */}
        <div className="mt-12 border-t border-surface2 pt-8">
          <p className="font-display text-lg text-ink mb-1">
            Managing two kids close in age?
          </p>
          <p className="text-ink-muted text-sm mb-4">
            Sibling Stack shows both kids' sleep and feed windows on one
            timeline — so you can see conflicts before they happen, not after.
            Free while we're in early access.
          </p>
          <EmailCaptureMdx source={`blog-${meta.slug}`} />
        </div>
      </div>
    </main>
  );
}
