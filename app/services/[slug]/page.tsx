import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav, SiteFooter } from "../../_components/chrome";
import { SERVICES, getService } from "../../_data/services";

/* Six pages, all static at build time — nothing here needs a server. */
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service — Truephase AI" };
  return {
    title: `${service.title} — Truephase AI`,
    description: service.lede,
    openGraph: { title: `${service.title} — Truephase AI`, description: service.lede },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  /* Written out rather than a digit — "Four steps" reads as prose, "4 steps"
     reads as a spec sheet, and services do not all have the same number. */
  const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
  const stepCount = WORDS[service.how.length] ?? String(service.how.length);

  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        {/* ── the ask ─────────────────────────────────────── */}
        <section className="wrap section">
          <div className="stack-40">
            <Link href="/#what" className="mono muted svc-back">
              ← All services
            </Link>

            <div className="stack-24" style={{ maxWidth: 940 }}>
              <span className="tag">{service.tag}</span>
              <h1 className="display">{service.title}</h1>
              <p className="subheading-lg muted prose">{service.lede}</p>
            </div>

            <div className="row">
              <a href="/#talk" className="btn btn-filled">
                Book a call
              </a>
              {service.project ? (
                <span className="mono quiet">
                  A project — booked in, built, handed over
                </span>
              ) : (
                <span className="mono quiet">Runs every day in the background</span>
              )}
            </div>
          </div>
        </section>

        {/* ── the problem, then the evidence ──────────────── */}
        <section className="band-inverted" id="why">
          <div className="wrap stack-40">
            <div className="stack-16" style={{ maxWidth: 780 }}>
              <span className="mono quiet">Why it matters</span>
              <p className="heading-sm">{service.problem}</p>
            </div>

            {service.stats.length > 0 && (
              <>
                <hr className="rule-dark" />
                <div className={service.stats.length === 2 ? "grid-2" : "grid-3"}>
                  {service.stats.map((s) => (
                    <div key={s.figure} className="stack-8 svc-stat">
                      <span className="svc-figure">{s.figure}</span>
                      <p className="body">{s.note}</p>
                      <span className="mono quiet">{s.source}</span>
                    </div>
                  ))}
                </div>
                <p className="body-sm quiet prose">
                  Figures from published industry research, not our own measurements.
                  Each one is attributed above.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── what you actually get ───────────────────────── */}
        <section className="wrap section">
          <div className="stack-40">
            <div className="stack-16" style={{ maxWidth: 680 }}>
              <span className="mono muted">What you get</span>
              <h2 className="heading">Included as standard</h2>
            </div>
            <div className="grid-2">
              {service.included.map((item) => (
                <article key={item.title} className="card stack-16">
                  <h3 className="heading-sm">{item.title}</h3>
                  <p className="body muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── how it gets done ────────────────────────────── */}
        <section className="wrap section">
          <div className="stack-40">
            <div className="stack-16" style={{ maxWidth: 680 }}>
              <span className="mono muted">How it works</span>
              <h2 className="heading">{stepCount} steps, in order</h2>
            </div>
            <ol className="stack-24 svc-steps">
              {service.how.map((h, i) => (
                <li key={h.step} className="svc-step">
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="stack-8">
                    <h3 className="heading-sm">{h.step}</h3>
                    <p className="body muted prose">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── the honest limits, where there are any ──────── */}
        {service.limits && service.limits.length > 0 && (
          <section className="wrap section">
            <div className="svc-limits stack-24">
              <div className="stack-16" style={{ maxWidth: 680 }}>
                <span className="mono muted">Straight answers</span>
                <h2 className="heading">What it will not do</h2>
                <p className="body muted prose">
                  Platform rules and regulation put real edges on this. Better you read them
                  here than find them after signing.
                </p>
              </div>
              <ul className="stack-16">
                {service.limits.map((line) => (
                  <li key={line} className="body svc-limit">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── who this suits ──────────────────────────────── */}
        <section className="wrap section">
          <div className="card-lg stack-24">
            <span className="mono muted">Who it’s for</span>
            <ul className="stack-8">
              {service.fit.map((line) => (
                <li key={line} className="subheading svc-fit">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── the rest of the range ───────────────────────── */}
        <section className="wrap section">
          <div className="stack-24">
            <span className="mono muted">The other {others.length}</span>
            <div className="svc-others">
              {others.map((o) => (
                <Link key={o.slug} href={`/services/${o.slug}`} className="svc-other">
                  <span className="tag tag-outline">{o.tag}</span>
                  <span className="heading-sm">{o.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── close ───────────────────────────────────────── */}
        <section className="band-inverted">
          <div className="wrap stack-24">
            <h2 className="heading-lg">Start with one, or take the lot</h2>
            <p className="subheading prose">
              Most practices start with the phone, because that is where the money is
              being lost, and add the rest once they trust it.
            </p>
            <a href="/#talk" className="btn btn-inverted" style={{ width: "fit-content" }}>
              Book a call
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
