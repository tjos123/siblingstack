import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, posts, CATEGORY_LABEL } from "@/lib/blog";
import EmailCaptureMdx from "@/components/EmailCaptureMdx";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Sibling Stack`,
    description: post.description,
  };
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderMarkdown(text: string): string {
  return text
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("## ")) {
        return `<h2>${inlineFormat(block.slice(3))}</h2>`;
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block
          .split(/\n/)
          .filter((l) => l.startsWith("- ") || l.startsWith("* "))
          .map((l) => `<li>${inlineFormat(l.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${inlineFormat(block)}</p>`;
    })
    .join("\n");
}

async function loadPostContent(slug: string): Promise<string | null> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const content = await fs.readFile(
      path.join(process.cwd(), "src", "content", "blog", `${slug}.mdx`),
      "utf-8"
    );
    return renderMarkdown(content);
  } catch {
    return null;
  }
}

function readingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
}

export default async function BlogPostPage({ params }: Props) {
  const meta = getPost(params.slug);
  if (!meta) notFound();

  const content = await loadPostContent(params.slug);
  if (!content) notFound();

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
            })}{" "}
            · {readingTime(content)}
          </p>
        </div>

        <div className="prose-sibling" dangerouslySetInnerHTML={{ __html: content }} />

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