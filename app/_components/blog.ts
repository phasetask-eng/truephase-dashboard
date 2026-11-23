/**
 * Blog posts live in Supabase (table `blog_posts`) and are written every
 * morning by the n8n workflow "Truephase · Daily blog + LinkedIn". The site
 * reads them here at request time, so a new post appears without a rebuild.
 *
 * The key below is Supabase's *publishable* (anon) key. It is public by design:
 * row-level security on the table only lets it read posts whose status is
 * "published". Writing needs the service key, which only n8n holds.
 */

const SUPABASE_URL = "https://gquczooqydhcfrqregxr.supabase.co";
const SUPABASE_KEY = "sb_publishable_2zY2S-EPWVisQtGDV9j2tA_uLQ3Y6Za";

/** How long a page may be served from cache before we re-read the table. */
export const BLOG_REVALIDATE_SECONDS = 300;

export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  excerpt: string | null;
  body_markdown: string;
  faq: BlogFaq[] | null;
  target_keyword: string | null;
  sector: string | null;
  pillar: string | null;
  published_at: string;
  updated_at: string;
};

export type BlogPostSummary = Pick<
  BlogPost,
  "slug" | "title" | "meta_description" | "excerpt" | "sector" | "pillar" | "published_at"
>;

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
    next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: ["blog"] },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status} for ${path}`);
  return (await res.json()) as T;
}

const SUMMARY_COLUMNS = "slug,title,meta_description,excerpt,sector,pillar,published_at";

/** Newest first. Only published posts come back (row-level security). */
export async function listPosts(limit = 200): Promise<BlogPostSummary[]> {
  try {
    return await rest<BlogPostSummary[]>(
      `blog_posts?select=${SUMMARY_COLUMNS}&status=eq.published&order=published_at.desc&limit=${limit}`,
    );
  } catch {
    /* A database hiccup should show an empty list, not a broken page. */
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await rest<BlogPost[]>(
      `blog_posts?select=*&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Up to three other posts, same sector first, for the "Keep reading" block. */
export async function relatedPosts(post: BlogPost): Promise<BlogPostSummary[]> {
  const all = await listPosts(60);
  const others = all.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.sector && p.sector === post.sector);
  const rest = others.filter((p) => !same.includes(p));
  return [...same, ...rest].slice(0, 3);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

/** Which service page a post should point readers to, by its pillar/sector. */
export function serviceFor(post: Pick<BlogPost, "pillar" | "sector" | "target_keyword">): {
  href: string;
  label: string;
} {
  const kw = `${post.pillar ?? ""} ${post.target_keyword ?? ""}`.toLowerCase();
  if (/chatbot|web chat|whatsapp/.test(kw)) return { href: "/services/ai-chatbot", label: "AI Chatbot" };
  if (/receptionist|call|answering|phone|customer service/.test(kw))
    return { href: "/services/ai-receptionist", label: "AI Receptionist" };
  if (/review/.test(kw)) return { href: "/services/review-management", label: "Review Management" };
  return { href: "/services/task-automation", label: "Task Automation" };
}
