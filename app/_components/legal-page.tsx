import { SiteNav, SiteFooter, CONTACT_EMAIL } from "./chrome";

/**
 * Honest placeholder shell for the three legal documents.
 *
 * These pages deliberately contain NO drafted legal text. Truephase handles
 * callers' personal data on behalf of its clients, and the wording of these
 * documents needs to come from a qualified UK solicitor or privacy
 * professional — not from a template and not from an AI.
 */
export function LegalPage({
  title,
  covers,
}: {
  title: string;
  covers: string[];
}) {
  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" className="wrap section">
        <div className="stack-40" style={{ maxWidth: 820 }}>
          <div className="stack-16">
            <span className="mono muted">Legal</span>
            <h1 className="heading-lg">{title}</h1>
          </div>

          <div className="card stack-16">
            <span className="tag tag-outline">In preparation</span>
            <p className="subheading muted prose">
              This document is being prepared with a qualified UK adviser and is not
              published yet. We would rather show you nothing than show you something we
              have not had checked.
            </p>
            <p className="body muted prose">
              If you need to know how Truephase AI handles your information before this is
              published, email us and we will answer in writing.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn btn-filled"
              style={{ width: "fit-content" }}
            >
              Ask us directly
            </a>
          </div>

          <div className="stack-16">
            <span className="mono muted">What this document will cover</span>
            <ul className="stack-8">
              {covers.map((line) => (
                <li
                  key={line}
                  className="subheading"
                  style={{ padding: "16px 0", borderBottom: "1px solid var(--color-ash)" }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
