import type { MetadataRoute } from "next";
import { SERVICES } from "./_data/services";
import { listPosts } from "./_components/blog";

export const revalidate = 300; // seconds; keep equal to BLOG_REVALIDATE_SECONDS

const SITE = "https://truephase.co.uk";

/* Google reads this list to find every page. Blog posts are added as they
   are published, so each morning's post is discoverable the same day. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts(500);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...SERVICES.map((s) => ({
      url: `${SITE}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...["/privacy", "/terms", "/cookies", "/accessibility"].map((p) => ({
      url: `${SITE}${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
