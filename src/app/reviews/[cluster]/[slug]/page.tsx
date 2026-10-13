import { notFound } from "next/navigation";
import {
  getPost,
  HUB_SLUG,
  REVIEW_CLUSTERS,
  REVIEW_SLUGS_BY_CLUSTER,
  type ReviewCluster,
} from "@/lib/blog";
import ArticleTemplate, {
  articleMetadata,
} from "@/components/ArticleTemplate";

const HUB_CLUSTERS = ["lovevery", "baby-food", "diapers", "digital-services"] as const;

interface Props {
  params: Promise<{ cluster: string; slug: string }>;
}

export function generateStaticParams() {
  return [
    ...HUB_CLUSTERS.flatMap((cluster) =>
      REVIEW_SLUGS_BY_CLUSTER[cluster]
        .filter((slug) => slug !== HUB_SLUG[cluster])
        .map((slug) => ({ cluster, slug }))
    ),
    ...(REVIEW_SLUGS_BY_CLUSTER.gear as string[]).map((slug) => ({
      cluster: "gear" as const,
      slug,
    })),
  ];
}

export async function generateMetadata({ params }: Props) {
  const { cluster: rawCluster, slug } = await params;
  const cluster = rawCluster as ReviewCluster;
  if (!(REVIEW_CLUSTERS.map((c) => c.slug) as string[]).includes(cluster)) return {};
  const post = getPost(slug);
  if (!post) return {};
  return articleMetadata(post, `reviews/${cluster}`);
}

export default async function ReviewsArticlePage({ params }: Props) {
  const { cluster: rawCluster, slug } = await params;
  const cluster = rawCluster as ReviewCluster;
  if (!(REVIEW_CLUSTERS.map((c) => c.slug) as string[]).includes(cluster)) notFound();
  return (
    <ArticleTemplate
      slug={slug}
      contentDir={`reviews/${cluster}`}
      basePath={`reviews/${cluster}`}
      relatedScope={cluster === "gear" ? "gear" : "all"}
      cluster={cluster}
    />
  );
}