import { getPost } from "@/lib/blog";
import ArticleTemplate, { articleMetadata } from "@/components/ArticleTemplate";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const { posts, canonicalRouteOf } = require("@/lib/blog");
  return posts
    .filter((p: { slug: string }) => canonicalRouteOf(p.slug).startsWith("/gear/"))
    .map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) return {};
  return articleMetadata(post, "gear");
}

export default function GearPostPage({ params }: Props) {
  return <ArticleTemplate slug={params.slug} contentDir="gear" basePath="gear" relatedScope="gear" />;
}