import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getRelatedPosts, CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/blog";
import type { PostMeta } from "@/lib/blog";
import EmailCaptureMdx from "@/components/EmailCaptureMdx";
import ShareButtons from "@/components/ShareButtons";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const { posts } = require("@/lib/blog");
  return posts.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://www.siblingstack.com/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.siblingstack.com/blog/${params.slug}`,
      siteName: "Sibling Stack",
      locale: "en_US",
      type: "article",
    },
  };
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/_(.*?)_/g, "<em>$1</em>");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderMarkdown(
  text: string,
  slug: string
): { html: string; headings: { id: string; text: string }[] } {
  const headings: { id: string; text: string }[] = [];

  const blocks = text.split(/\n\n+/);
  const processed = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      if (block.startsWith(":::tip") || block.startsWith(":::warning")) {
        const type = block.startsWith(":::tip") ? "tip" : "warning";
        const inner = block
          .replace(/^:::(tip|warning)\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const label = type === "tip" ? "Tip" : "Warning";
        return `<div class="callout callout-${type}"><span class="callout-label">${label}</span>${inlineFormat(inner)}</div>`;
      }

      if (block.startsWith("## ")) {
        const raw = block.slice(3);
        const id = slugify(raw);
        headings.push({ id, text: raw });
        return `<h2 id="${id}">${inlineFormat(raw)}</h2>`;
      }

      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block
          .split(/\n/)
          .filter((l) => l.startsWith("- ") || l.startsWith("* "))
          .map((l) => `<li>${inlineFormat(l.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (block === "---" || block.startsWith("---")) {
        return `<hr />`;
      }

      return `<p>${inlineFormat(block)}</p>`;
    })
    .join("\n");

  let html = processed.replace(
    /\[Join the waitlist\]/g,
    `<a href="#blog-cta-section" style="color:#D98C5F;text-decoration:underline;font-weight:600;">Join the waitlist</a>`
  );

  return { html, headings };
}

async function loadPostContent(
  slug: string
): Promise<{ html: string; headings: { id: string; text: string }[] } | null> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const content = await fs.readFile(
      path.join(process.cwd(), "src", "content", "blog", `${slug}.mdx`),
      "utf-8"
    );
    return renderMarkdown(content, slug);
  } catch {
    return null;
  }
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

function RelatedCard({ post }: { post: PostMeta }) {
  const color = CATEGORY_COLOR[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="block group flex-1 min-w-0">
      <article className="h-full border border-surface2 rounded-lg p-4 hover:border-childA transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color }}
          >
            {CATEGORY_LABEL[post.category]}
          </span>
          <span className="text-ink-muted text-xs font-mono">
            · {post.readingTimeMinutes} min
          </span>
        </div>
        <h3 className="font-display text-sm text-ink leading-snug group-hover:text-childA transition-colors">
          {post.title}
        </h3>
      </article>
    </Link>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const meta = getPost(params.slug);
  if (!meta) notFound();

  const content = await loadPostContent(params.slug);
  if (!content) notFound();

  const related = getRelatedPosts(params.slug, 2);
  const accentColor = CATEGORY_COLOR[meta.category];

  const publishedDate = new Date(meta.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen">
      <div
        className="px-6 pt-10 pb-10"
        style={{
          background: "linear-gradient(180deg, #25201a 0%, #1c1815 100%)",
          borderBottom: `1px solid ${accentColor}25`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-ink-muted hover:text-ink transition-colors">
              Sibling Stack
            </Link>
            <span className="text-surface2">›</span>
            <Link href="/blog" className="text-ink-muted hover:text-ink transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <CategoryPill category={meta.category} />
            <span className="text-ink-muted text-xs font-mono">
              {meta.readingTimeMinutes} min read
            </span>
          </div>

          <h1
            className="font-display text-3xl text-ink leading-tight mb-4"
            style={{ maxWidth: "22ch" }}
          >
            {meta.title}
          </h1>

          <p
            className="text-lg leading-relaxed mb-5"
            style={{ color: "#ccc5b8", maxWidth: "50ch" }}
          >
            {meta.description}
          </p>

          <p className="text-ink-muted text-xs font-mono">
            By Sibling Stack · {publishedDate}
          </p>
        </div>
      </div>

      {meta.readingTimeMinutes > 4 && content.headings.length > 0 && (
        <div className="px-6 pt-8 pb-2">
          <div className="max-w-2xl mx-auto">
            <details className="group border border-surface2 rounded-lg">
              <summary className="text-xs font-mono text-ink-muted uppercase tracking-widest cursor-pointer select-none px-4 py-2.5 hover:text-ink transition-colors">
                On this page
                <span className="ml-2 text-surface3 group-open:hidden">↓</span>
                <span className="ml-2 text-surface3 hidden group-open:inline">↑</span>
              </summary>
              <div className="border-t border-surface2 px-4 py-3">
                <ul className="flex flex-col gap-1.5">
                  {content.headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-ink-muted text-sm hover:text-childA transition-colors"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      )}

      <div className="px-6 pt-10 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="prose-sibling" dangerouslySetInnerHTML={{ __html: content.html }} />
        </div>
      </div>

      <div className="px-6 pb-10">
        <div className="max-w-2xl mx-auto border-t border-surface2 pt-6">
          <ShareButtons slug={params.slug} title={meta.title} />
        </div>
      </div>

      <div className="px-6 py-10" id="blog-cta-section">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-xl p-7"
            style={{
              background: "linear-gradient(135deg, #25201a 0%, #1e1a15 100%)",
              border: `1px solid ${accentColor}30`,
              borderLeft: `4px solid ${accentColor}`,
            }}
          >
            <p className="text-xs font-mono uppercase tracking-widest mb-3"
               style={{ color: accentColor }}>
              Free to use
            </p>
            <h2 className="font-display text-xl text-ink mb-2">
              Managing two kids close in age?
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              Sibling Stack shows both your kids' sleep and feed windows on one
              timeline — so you can see conflicts before they happen, not after.
              No subscription required.
            </p>
            <EmailCaptureMdx source={`blog-${meta.slug}`} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="border-t border-surface2 pt-8">
              <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4">
                More to read
              </p>
              <div className="flex gap-4">
                {related.map((post) => (
                  <RelatedCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
