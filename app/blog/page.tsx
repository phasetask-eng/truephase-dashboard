import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter, BOOKING_URL } from "../_components/chrome";
import { listPosts, formatDate } from "../_components/blog";

export const revalidate = 300; // seconds; keep equal to BLOG_REVALIDATE_SECONDS

export const metadata: Metadata = {
  title: "Blog — practical automation for UK small businesses | Truephase AI",
  description:
    "Plain-English guides on AI receptionists, n8n workflow automation and cutting admin for UK dental practices, salons, trades, care homes, letting agents and accountants.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Truephase AI blog — practical automation for UK small businesses",
    description:
      "Plain-English guides on AI receptionists, workflow automation and cutting admin for UK small businesses.",
  },
};

export default async function BlogIndex() {
  const posts = await listPosts();
  const [latest, ...older] = posts;

  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" tabIndex={-1}>
        <section className="wrap section">
          <div className="stack-40">
            <div className="stack-24" style={{ maxWidth: 940 }}>
              <span className="tag">Blog</span>
              <h1 className="display">Practical automation, in plain English</h1>
              <p className="subheading-lg muted prose">
                Missed calls, no-shows, admin at 9pm, chasing invoices. One short guide a day
                on fixing the problems UK small businesses actually have.
              </p>
            </div>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="wrap section">
            <p className="body muted">First posts are on their way. Check back tomorrow.</p>
          </section>
        ) : (
          <>
            {latest && (
              <section className="wrap">
                <Link href={`/blog/${latest.slug}`} className="card blog-feature stack-16">
                  <span className="mono muted">
                    Latest · {formatDate(latest.published_at)}
                    {latest.sector && latest.sector !== "General" ? ` · ${latest.sector}` : ""}
                  </span>
                  <h2 className="heading-lg">{latest.title}</h2>
                  <p className="body prose">{latest.excerpt ?? latest.meta_description}</p>
                  <span className="mono">Read the guide →</span>
                </Link>
              </section>
            )}

            {older.length > 0 && (
              <section className="wrap section">
                <div className="stack-40">
                  <span className="mono muted">All guides</span>
                  <div className="grid-2 blog-grid">
                    {older.map((p) => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="card blog-card stack-16">
                        <span className="mono muted">
                          {formatDate(p.published_at)}
                          {p.sector && p.sector !== "General" ? ` · ${p.sector}` : ""}
                        </span>
                        <h3 className="heading-sm">{p.title}</h3>
                        <p className="body-sm prose">{p.excerpt ?? p.meta_description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <section className="band-inverted">
          <div className="wrap stack-24">
            <h2 className="heading">Got a problem like these?</h2>
            <p className="body prose">
              A 30-minute call is the quickest way to find out what we would automate first and
              what it would cost.
            </p>
            <div className="row">
              <Link href={BOOKING_URL} className="btn btn-filled">
                Book a call
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
