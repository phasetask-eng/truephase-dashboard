import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav, SiteFooter, CONTACT_EMAIL, COMPANY } from "./chrome";

/**
 * Long-form legal document on the site's own design system.
 *
 * Every document opens with a plain-English summary, lists its sections, then
 * sets them out in order. Nothing here is a template: the content of each page
 * is written from what the code and the database actually do, and each page
 * carries a version and a date so a client can tell which wording they agreed
 * to. Commercial and liability terms still need a solicitor's eye; the pages
 * say so where it applies.
 */

export type LegalSection = {
  id: string;
  heading: string;
  body: ReactNode;
};

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/terms", label: "Terms of service" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/accessibility", label: "Accessibility statement" },
];

export function LegalDoc({
  kicker = "Legal",
  title,
  summary,
  inShort,
  version,
  updated,
  sections,
  currentPath,
}: {
  kicker?: string;
  title: string;
  summary: string;
  /** three to six one-sentence bullets a busy reader can stop at */
  inShort: string[];
  version: string;
  updated: string;
  sections: LegalSection[];
  currentPath: string;
}) {
  const others = LEGAL_PAGES.filter((p) => p.href !== currentPath);

  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" className="wrap section">
        <div className="legal stack-40">
          <header className="stack-16">
            <span className="mono muted">{kicker}</span>
            <h1 className="heading-lg">{title}</h1>
            <p className="subheading muted prose">{summary}</p>
            <p className="mono quiet">
              Version {version} · Last updated {updated}
            </p>
          </header>

          <section className="card stack-16" aria-labelledby="in-short">
            <span id="in-short" className="mono muted">
              In short
            </span>
            <ul className="legal-short stack-8">
              {inShort.map((line) => (
                <li key={line} className="subheading">
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <nav className="stack-8" aria-label="On this page">
            <span className="mono muted">On this page</span>
            <ol className="legal-toc">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="legal-num">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-body stack-40">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="legal-section stack-16"
                aria-labelledby={`${s.id}-heading`}
              >
                <h2 id={`${s.id}-heading`} className="heading-sm">
                  <span className="legal-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                {s.body}
              </section>
            ))}
          </div>

          <section className="card-inverted stack-16" aria-labelledby="legal-contact">
            <span id="legal-contact" className="mono quiet">
              Questions about this document
            </span>
            <p className="subheading prose">
              Email us and a person will answer in writing. We do not use automated replies
              for anything on these pages.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn btn-inverted"
              style={{ width: "fit-content" }}
            >
              {CONTACT_EMAIL}
            </a>
            <p className="body-sm quiet prose">
              {COMPANY.legalName}, trading as {COMPANY.tradingName}. Registered in{" "}
              {COMPANY.registeredIn}, company number {COMPANY.number}. Registered office:{" "}
              {COMPANY.registeredOffice}.
            </p>
          </section>

          <nav className="stack-8" aria-label="Other legal documents">
            <span className="mono muted">Also read</span>
            <ul className="legal-related">
              {others.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="tag tag-outline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/** A small, honest table: who, what, why. Scrolls sideways on a phone rather
    than squashing. */
export function LegalTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="legal-table-wrap">
      <table className="legal-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
