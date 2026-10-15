import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SiteNav, SiteFooter, BOOKING_URL } from "../../_components/chrome";
import {
  getPost,
  relatedPosts,
  formatDate,
  serviceFor,
  type BlogFaq,
} from "../../_components/blog";

export const revalidate = 300; // seconds; keep equal to BLOG_REVALIDATE_SECONDS
/* Slugs are not known at build time: new posts arrive every day. */
export const dynamicParams = true;

const SITE = "https://truephase.co.uk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found — Truephase AI" };
  const title = `${post.title} | Truephase AI`;
  return {
    title,
    description: post.meta_description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.meta_description,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    },
  };
}

/* The body is Markdown written by our own pipeline. We still refuse raw HTML:
   anything that looks like a tag is shown as text, so a stray "<script>" in a
   post could never run. Markdown's own syntax (headings, lists, links, bold)
   renders normally. */
function renderMarkdown(md: string): string {
  const noHtml = md.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return marked.parse(noHtml, { async: false, gfm: true, breaks: false }) as string;
}

/* Split the article after its second H2 so a quiet call-to-action can sit in
   the middle of the read, the way the pages that rank for these searches do. */
function splitAtSecondHeading(md: string): [string, string] {
  const marks = [...md.matchAll(/^## /gm)].map((m) => m.index ?? 0);
  if (marks.length < 4) return [md, ""];
  const cut = marks[2];
  return [md.slice(0, cut), md.slice(cut)];
}

function isFaq(x: unknown): x is BlogFaq {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as BlogFaq).q === "string" &&
    typeof (x as BlogFaq).a === "string"
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const faq = Array.isArray(post.faq) ? post.faq.filter(isFaq) : [];
  const [firstHalf, secondHalf] = splitAtSecondHeading(post.body_markdown);
  const related = await relatedPosts(post);
  const service = serviceFor(post);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.meta_description,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      inLanguage: "en-GB",
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      author: { "@type": "Organization", name: "Truephase AI", url: SITE },
      publisher: { "@type": "Organization", name: "Truephase AI", url: SITE },
    },
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="wrap section">
          <div className="legal stack-40">
            <Link href="/blog" className="mono muted svc-back">
              <span aria-hidden="true">←</span> All guides
            </Link>

            <header className="stack-16">
              <span className="mono muted">
                {formatDate(post.published_at)}
                {post.sector && post.sector !== "General" ? ` · ${post.sector}` : ""}
              </span>
              <h1 className="heading-lg">{post.title}</h1>
              {post.excerpt && <p className="subheading-lg muted prose">{post.excerpt}</p>}
            </header>

            <div
              className="legal-body blog-body stack-16"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(firstHalf) }}
            />

            {secondHalf && (
              <>
                <aside className="card blog-cta stack-16">
                  <span className="mono muted">Working on something like this?</span>
                  <p className="body">
                    Tell us the problem on a 30-minute call. We will say what we would automate
                    first, and what it would cost.
                  </p>
                  <div className="row">
                    <Link href={BOOKING_URL} className="btn btn-filled">
                      Book a call
                    </Link>
                    <Link href={service.href} className="btn btn-ghost">
                      See {service.label}
                    </Link>
                  </div>
                </aside>

                <div
                  className="legal-body blog-body stack-16"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(secondHalf) }}
                />
              </>
            )}

            {faq.length > 0 && (
              <section className="stack-24" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="heading">
                  Questions people ask
                </h2>
                <dl className="legal-body stack-16">
                  {faq.map((f) => (
                    <div key={f.q} className="blog-faq stack-8">
                      <dt className="blog-faq-q">{f.q}</dt>
                      <dd>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <aside className="card-inverted blog-cta stack-16">
              <h2 className="heading">Ready to stop losing calls and evenings?</h2>
              <p className="body">
                Book a free 30-minute call. No slides, no hard sell: we look at your business and
                tell you what we would fix first.
              </p>
              <div className="row">
                <Link href={BOOKING_URL} className="btn btn-filled">
                  Book a call
                </Link>
                <Link href={service.href} className="btn btn-ghost">
                  {service.label}
                </Link>
              </div>
            </aside>

            {related.length > 0 && (
              <section className="stack-24" aria-labelledby="related-heading">
                <h2 id="related-heading" className="mono muted">
                  Keep reading
                </h2>
                <div className="grid-3 blog-grid">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="card blog-card stack-8">
                      <span className="mono muted">{formatDate(p.published_at)}</span>
                      <h3 className="heading-sm">{p.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
