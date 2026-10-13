import { getPost } from "@/lib/blog";
import ArticleTemplate, { articleMetadata } from "@/components/ArticleTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const { posts, canonicalRouteOf } = require("@/lib/blog");
  return posts
    .filter((p: { slug: string }) => canonicalRouteOf(p.slug).startsWith("/blog/"))
    .map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return articleMetadata(post, "blog");
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <ArticleTemplate slug={slug} contentDir="blog" basePath="blog" relatedScope="all" />;
}