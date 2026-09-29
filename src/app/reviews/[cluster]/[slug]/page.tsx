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

const HUB_CLUSTERS = ["lovevery", "baby-food", "diapers"] as const;

interface Props {
  params: { cluster: string; slug: string };
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
  const cluster = params.cluster as ReviewCluster;
  if (!(REVIEW_CLUSTERS.map((c) => c.slug) as string[]).includes(cluster)) return {};
  const post = getPost(params.slug);
  if (!post) return {};
  return articleMetadata(post, `reviews/${cluster}`);
}

export default function ReviewsArticlePage({ params }: Props) {
  const cluster = params.cluster as ReviewCluster;
  if (!(REVIEW_CLUSTERS.map((c) => c.slug) as string[]).includes(cluster)) notFound();
  return (
    <ArticleTemplate
      slug={params.slug}
      contentDir={`reviews/${cluster}`}
      basePath={`reviews/${cluster}`}
      relatedScope={cluster === "gear" ? "gear" : "all"}
      cluster={cluster}
    />
  );
}