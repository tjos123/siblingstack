import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getRelatedPosts, CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/blog";
import { getBlogSchema } from "@/lib/blog-schemas";
import type { PostMeta } from "@/lib/blog";
import ShareButtons from "@/components/ShareButtons";
import SiteHeader from "@/components/SiteHeader";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

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
    authors: [{ name: "James T. Reilly" }],
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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
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

      if (block.startsWith(":::alert")) {
        const inner = block
          .replace(/^:::alert\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const label = "Worth knowing";
        return `<div class="callout callout-alert"><span class="callout-label">${label}</span>${inlineFormat(inner)}</div>`;
      }

      if (block.startsWith(":::stats")) {
        const inner = block
          .replace(/^:::stats\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const firstNonStat = lines.find((l) => !l.includes("|"));
        const heading = firstNonStat || "";
        const statLines = firstNonStat
          ? lines.filter((l) => l !== firstNonStat)
          : lines;
        const cards = statLines
          .map((line) => {
            const [number, label] = line.split("|").map((s) => s.trim());
            return `<div class="stat-card">
                <div class="stat-number">${inlineFormat(number)}</div>
                <div class="stat-label">${inlineFormat(label)}</div>
              </div>`;
          })
          .join("");
        return `<div class="stat-grid">${cards}</div>${
          heading ? `<div class="stat-caption">${inlineFormat(heading)}</div>` : ""
        }`;
      }

      if (block.startsWith(":::table")) {
        const inner = block
          .replace(/^:::table\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const cells = (line: string) =>
          line
            .split("|")
            .map((c) => c.trim())
            .map((c) => inlineFormat(c));
        const [headRow, ...bodyRows] = lines;
        const head = headRow
          ? `<thead><tr>${cells(headRow)
              .map((c) => `<th>${c}</th>`)
              .join("")}</tr></thead>`
          : "";
        const body = `<tbody>${bodyRows
          .map(
            (r) =>
              `<tr>${cells(r)
                .map((c) => `<td>${c}</td>`)
                .join("")}</tr>`
          )
          .join("")}</tbody>`;
        return `<div class="table-wrap"><table class="data-table">${head}${body}</table></div>`;
      }

      if (block.startsWith(":::quickpicks")) {
        const inner = block
          .replace(/^:::quickpicks\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const cards = inner
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [badge, title, desc, href] = line
              .split("|")
              .map((s) => s.trim());
            return `<a class="qp-card" href="${href}">
                <span class="qp-badge">${badge}</span>
                <span class="qp-title">${inlineFormat(title)}</span>
                <span class="qp-desc">${inlineFormat(desc)}</span>
                <span class="qp-link">View Details ↓</span>
              </a>`;
          })
          .join("");
        return `<div class="quick-picks"><p class="quick-picks-heading">⚡ Quick Picks at a Glance</p><div class="quick-picks-grid">${cards}</div></div>`;
      }

      if (block.startsWith(":::matrix")) {
        const inner = block
          .replace(/^:::matrix\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const heading = lines.shift() || "Which option fits your stage?";
        const cards = lines
          .map((line) => {
            const [badge, title, desc, anchor, linkLabel] = line
              .split("|")
              .map((s) => s.trim());
            return `<a class="qp-card" href="#${anchor}" data-decision-card>
                <span class="qp-badge qp-badge-${anchor}">${badge}</span>
                <span class="qp-title">${inlineFormat(title)}</span>
                <span class="qp-desc">${inlineFormat(desc)}</span>
                <span class="qp-link">${linkLabel || "Explore →"}</span>
              </a>`;
          })
          .join("");
        return `<div class="quick-picks"><p class="quick-picks-heading">${heading}</p><div class="quick-picks-grid decision-grid">${cards}</div></div>`;
      }

      if (block.startsWith(":::product")) {
        const inner = block.replace(/^:::product\n?/, "").replace(/\n?:::$/, "").trim();
        const lines = inner.split(/\n/).map((l) => l.trim());
        const header = lines[0].split("|").map((s) => s.trim());
        const [href, title, subtitle] = header.length === 3 ? header : [lines[0].split("|")[0], lines[0], ""];
        const specs = lines
          .filter((l) => l.startsWith("spec:") || l.startsWith("spec!:"))
          .map((l) => {
            const golden = l.startsWith("spec!:");
            return `<span class="spec-tag${golden ? " spec-tag-golden" : ""}">${inlineFormat(
              l.replace(/^spec!?:\s*/, "")
            )}</span>`;
          })
          .join("");
        const badges = lines
          .filter((l) => l.startsWith("badge:"))
          .map((l) => `<span class="badge">${inlineFormat(l.replace(/^badge:\s*/, ""))}</span>`)
          .join("");
        const alertLine = lines.find((l) => l.startsWith("alert"));
        const alert = alertLine
          ? (() => {
              const labelMatch = alertLine.match(/^alert\s+([^:]+):\s*([\s\S]*)$/);
              const label = labelMatch ? labelMatch[1].trim() : "Worth knowing";
              const text = labelMatch ? labelMatch[2] : alertLine.replace(/^alert:\s*/, "");
              return `<div class="callout callout-alert"><span class="callout-label">${label}</span>${inlineFormat(text)}</div>`;
            })()
          : "";
        const bodyLines = lines
          .filter(
            (l) =>
              !l.startsWith("spec:") &&
              !l.startsWith("spec!:") &&
              !l.startsWith("badge:") &&
              !l.startsWith("alert:") &&
              l !== lines[0]
          );
        const hasList = bodyLines.some((l) => l.startsWith("- "));
        const body = bodyLines
          .map((l) =>
            l.startsWith("- ")
              ? `<li>${inlineFormat(l.slice(2))}</li>`
              : `<p>${inlineFormat(l)}</p>`
          )
          .join("");
        const bodyHtml = hasList
          ? body.replace(/(<li>.*<\/li>)+/, (list) => `<ul>${list}</ul>`)
          : body;
        return `<section id="${href.split("#")[1] || href}" class="product-card">
            ${badges ? `<div class="badge-bar">${badges}</div>` : ""}
            <h3>${inlineFormat(title)}</h3>
            ${subtitle ? `<span class="product-subtitle">${inlineFormat(subtitle)}</span>` : ""}
            ${specs ? `<div class="specs-row">${specs}</div>` : ""}
            ${bodyHtml}
            ${alert}
          </section>`;
      }

      if (block.startsWith(":::schedule")) {
        const inner = block
          .replace(/^:::schedule\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim());
        const header = lines[0].split("|").map((s) => s.trim());
        const [sid, stitle, ssubtitle] =
          header.length >= 3 ? header : [header[0], header[0] || "Schedule", ""];
        const specs = lines
          .filter((l) => l.startsWith("spec:") || l.startsWith("spec!:"))
          .map((l) => {
            const golden = l.startsWith("spec!:");
            return `<span class="spec-tag${golden ? " spec-tag-golden" : ""}">${inlineFormat(
              l.replace(/^spec!?:\s*/, "")
            )}</span>`;
          })
          .join("");
        const steps = lines
          .filter((l) => l.startsWith("t|"))
          .map((l) => {
            const [time, text] = l.slice(2).split("|").map((s) => s.trim());
            const golden = time.includes("🌟") || time.includes("GOLDEN");
            return `<div class="timeline-item${golden ? " timeline-golden" : ""}">
                <div class="timeline-time">${inlineFormat(time)}</div>
                <div>${inlineFormat(text)}</div>
              </div>`;
          })
          .join("");
        const body = lines
          .filter(
            (l) =>
              l !== lines[0] &&
              !l.startsWith("spec:") &&
              !l.startsWith("spec!:") &&
              !l.startsWith("t|") &&
              !l.startsWith("alert:")
          )
          .join(" ");
        const alertLine = lines.find((l) => l.startsWith("alert"));
        const alert = alertLine
          ? (() => {
              const labelMatch = alertLine.match(/^alert\s+([^:]+):\s*([\s\S]*)$/);
              const label = labelMatch ? labelMatch[1].trim() : "Worth knowing";
              const text = labelMatch ? labelMatch[2] : alertLine.replace(/^alert:\s*/, "");
              return `<div class="callout callout-alert"><span class="callout-label">${label}</span>${inlineFormat(
                text
              )}</div>`;
            })()
          : "";
        return `<section id="${sid || "schedule"}" class="schedule-card product-card">
            <h3>${inlineFormat(stitle)}</h3>
            ${ssubtitle ? `<span class="product-subtitle">${inlineFormat(ssubtitle)}</span>` : ""}
            ${specs ? `<div class="specs-row">${specs}</div>` : ""}
            ${body ? `<p>${inlineFormat(body)}</p>` : ""}
            ${steps ? `<div class="timeline">${steps}</div>` : ""}
            ${alert}
          </section>`;
      }

      if (block.startsWith(":::tldr")) {
        const inner = block
          .replace(/^:::tldr\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const heading = lines.shift() || "⚡ Quick Takeaways for Busy Parents";
        const items = lines
          .map((l) => `<li>${inlineFormat(l)}</li>`)
          .join("");
        return `<div class="tldr-box"><h3>${inlineFormat(heading)}</h3><ul class="tldr-list">${items}</ul></div>`;
      }

      if (block.startsWith(":::split")) {
        const inner = block
          .replace(/^:::split\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const variants = ["newborn", "toddler"];
        const cards = lines
          .map((line, idx) => {
            const [emoji, title, body] = line.split("|").map((s) => s.trim());
            const variant = variants[idx % variants.length];
            return `<div class="split-card split-${variant}">
                <h4>${emoji} ${inlineFormat(title)}</h4>
                <p>${inlineFormat(body)}</p>
              </div>`;
          })
          .join("");
        return `<div class="split-grid">${cards}</div>`;
      }

      if (block.startsWith(":::strategy")) {
        const inner = block
          .replace(/^:::strategy\n?/, "")
          .replace(/\n?:::$/, "");
        const cards = inner
          .split(/\n---\n/)
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .map((chunk) => {
            const [title, ...body] = chunk.split(/\n/);
            return `<div class="strategy-card">
                <h4>${inlineFormat(title)}</h4>
                <p>${inlineFormat(body.join(" "))}</p>
              </div>`;
          })
          .join("");
        return cards;
      }

      if (block.startsWith(":::collision")) {
        const inner = block
          .replace(/^:::collision\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const title = lines.shift() || "⚠️ Managing Peak Schedule Collisions";
        return `<div class="collision-box"><h3>${inlineFormat(title)}</h3><p>${inlineFormat(
          lines.join(" ")
        )}</p></div>`;
      }

      if (block.startsWith(":::linkcard")) {
        const inner = block
          .replace(/^:::linkcard\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const [label, href, text] = lines[0].split("|").map((s) => s.trim());
        return `<div class="internal-link-card">
            <span>${inlineFormat(label)}</span>
            <a href="${href}">${inlineFormat(text)}</a>
          </div>`;
      }

      if (block.startsWith(":::ataglance")) {
        const inner = block
          .replace(/^:::ataglance\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const heading = lines.shift() || "⚡ Quick Picks & Key Takeaways at a Glance";
        const cards = lines
          .map((line) => {
            const [label, title, desc, anchor] = line.split("|").map((s) => s.trim());
            return `<div class="glance-card">
                <span class="glance-label">${inlineFormat(label)}</span>
                <p class="glance-title">${inlineFormat(title)}</p>
                <a href="#${anchor}" class="glance-link">Read More ↓</a>
              </div>`;
          })
          .join("");
        return `<div class="at-a-glance"><h3>${inlineFormat(heading)}</h3><div class="grid-container">${cards}</div></div>`;
      }

      if (block.startsWith(":::section")) {
        const inner = block
          .replace(/^:::section\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const head = lines.shift()!.split("|").map((s) => s.trim());
        const [sid, stitle] = head.length >= 2 ? head : [head[0], head[0]];
        const badges = lines
          .filter((l) => l.startsWith("badge:"))
          .map((l) => `<span class="badge">${inlineFormat(l.replace(/^badge:\s*/, ""))}</span>`)
          .join("");
        const paras = lines
          .filter((l) => !l.startsWith("badge:"))
          .map((l) => {
            if (l.startsWith("- ")) {
              return `<li>${inlineFormat(l.slice(2))}</li>`;
            }
            return `<p>${inlineFormat(l)}</p>`;
          })
          .join("");
        const hasList = lines.some((l) => l.startsWith("- "));
        const body = hasList
          ? paras.replace(
              /(<li>.*<\/li>)+/g,
              (list) => `<ul>${list}</ul>`
            )
          : paras;
        return `<div id="${sid}" class="section-card">
            ${badges ? `<div class="badge-bar">${badges}</div>` : ""}
            <h2>${inlineFormat(stitle)}</h2>
            ${body}
          </div>`;
      }

      if (block.startsWith(":::checklist")) {
        const inner = block
          .replace(/^:::checklist\n?/, "")
          .replace(/\n?:::$/, "")
          .trim();
        const lines = inner.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const firstNonItem = lines.find((l) => !l.startsWith("- ") && !l.startsWith("* "));
        const heading = firstNonItem || "Checklist";
        const itemLines = firstNonItem
          ? lines.filter((l) => l !== firstNonItem)
          : lines;
        const items = itemLines
          .map((l) => `<li><span class="cbox-check">🔹</span><div>${inlineFormat(l.replace(/^[-*]\s*/, ""))}</div></li>`)
          .join("");
        return `<div class="checklist-box"><h3>${inlineFormat(heading)}</h3><ul class="checklist">${items}</ul></div>`;
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
    `<a href="/sign-up" style="color:#D98C5F;text-decoration:underline;font-weight:600;">Get started free</a>`
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
  const schemas = getBlogSchema(params.slug);
  const schemaList = schemas
    ? Array.isArray(schemas)
      ? schemas
      : [schemas]
    : [];

  const enriched = schemaList.map((s) => {
    const record = s as Record<string, unknown>;
    if (record["@type"] === "Article") {
      return {
        ...record,
        datePublished: record.datePublished ?? meta.publishedAt,
        dateModified: record.dateModified ?? meta.publishedAt,
        inLanguage: record.inLanguage ?? "en-US",
      };
    }
    return s;
  });

  const publishedDate = new Date(meta.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen">
      <SiteHeader />
      {enriched.map((s) => (
        <script
          key={JSON.stringify(s["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
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
            By James T. Reilly · {publishedDate}
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

      {meta.category === "wellbeing" && (
        <div className="px-6 pb-10">
          <div className="max-w-2xl mx-auto">
            <MedicalDisclaimer />
          </div>
        </div>
      )}

      <div className="px-6 pb-10">
        <div className="max-w-2xl mx-auto border-t border-surface2 pt-6">
          <Link
            href="/irish-twins-guide"
            className="inline-flex items-center gap-2 text-sm text-childB hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span>
            Irish twins: the complete guide
          </Link>
        </div>
      </div>

      <div className="px-6 pb-10">
        <div className="max-w-2xl mx-auto border-t border-surface2 pt-6">
          <ShareButtons slug={params.slug} title={meta.title} />
        </div>
      </div>

      <div className="px-6 pb-10">
        <div
          className="max-w-2xl mx-auto flex gap-4 items-start rounded-xl p-6"
          style={{
            background: "linear-gradient(135deg, #25201a 0%, #1e1a15 100%)",
            border: `1px solid ${accentColor}25`,
          }}
        >
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm text-ink shrink-0 border border-surface3"
            style={{ background: "#241f1a" }}
          >
            JR
          </span>
          <div>
            <p className="text-sm text-ink font-medium mb-1">
              James T. Reilly
            </p>
            <p className="text-ink-muted text-sm leading-relaxed">
              James Reilly is the father of Irish twins and writes Sibling
              Stack&apos;s guides from the inside — the gear that actually held
              up, the schedules that actually synced, and the stuff nobody warns
              you about when two kids are close enough in age that everything
              overlaps.
            </p>
          </div>
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
            <Link
              href="/sign-up"
              className="inline-block bg-childA text-bg font-medium rounded-md py-2.5 px-5 text-sm hover:opacity-90 transition-opacity"
            >
              Create your account
            </Link>
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
