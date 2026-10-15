import Link from "next/link";
import { HoverLoop, Magnetic } from "./motion/index";

const NAV = [
  { href: "/#what", label: "What it does" },
  { href: "/#how", label: "How it works" },
  { href: "/#who", label: "Who it’s for" },
  { href: "/#questions", label: "Questions" },
  { href: "/blog", label: "Blog" },
];

/* The client portal is its own application, not a route in this site, so this
   is a real link out rather than a next/link route. Set NEXT_PUBLIC_PORTAL_URL
   to wherever it is hosted; it falls back to the local dev server, so the link
   works today and does not ship a localhost address once the portal has a
   public home. */
const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("NEXT_PUBLIC_PORTAL_URL must be set for production builds");
      })()
    : "http://localhost:4174");

/* One address for the whole site. Every mailto and every visible email reads
   from here so the footer, the contact section and the legal pages can never
   drift apart again. */
export const CONTACT_EMAIL = "info@truephase.co.uk";

/** The Book a call page: visitors pick a free 30-minute slot (see app/book). */
export const BOOKING_URL = "/book";

export { PORTAL_URL };

/* The company behind the brand, as it appears on the Companies House
   register. Shown in the footer and on the legal pages. */
export const COMPANY = {
  legalName: "Truephase AI Limited",
  number: "17469289",
  registeredIn: "England and Wales",
  registeredOffice: "11 St. Nicholas Road, Thorne, Doncaster, DN8 5BS",
  tradingName: "Truephase AI",
  /* Supervisory authority for data protection in the UK */
  ico: { name: "Information Commissioner's Office", url: "https://ico.org.uk/make-a-complaint/" },
};

export function SiteNav() {
  return (
    <header className="nav-bar">
      <div className="nav-inner">
        <Link href="/" className="wordmark" aria-label="Truephase AI — home">
          <Logo />
        </Link>

        <nav className="nav-pill" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              <HoverLoop>{item.label}</HoverLoop>
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={PORTAL_URL} className="btn btn-ghost">
            <HoverLoop>Client login</HoverLoop>
          </a>
          <Magnetic>
            <Link href={BOOKING_URL} className="btn btn-filled">
              <HoverLoop>Book a call</HoverLoop>
            </Link>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}

/* Truephase "split phase" logo (direction 2b, Claude Design, Oct 2026).
   The mark paths are copied exactly from the handoff's master files; the
   viewBox is cropped tight to them so the mark lines up with the lettering.
   The name is set in Anton, the same face the outlined lockup uses. */
function Logo({ tone = "paper" }: { tone?: "paper" | "carbon" }) {
  const onCarbon = tone === "carbon";
  return (
    <>
      <svg className="wm-mark" viewBox="9 7 46 50" aria-hidden="true" focusable="false">
        {onCarbon ? (
          <>
            <path fill="#efefed" d="M29 7A20 20 0 0 0 29 47Z" />
            <path fill="#fff100" d="M35 17A20 20 0 0 1 35 57Z" />
          </>
        ) : (
          <>
            <path fill="#0a0a0a" d="M29 7A20 20 0 0 0 29 47Z" />
            <path fill="#0a0a0a" d="M35 17A20 20 0 0 1 35 57Z" />
            <path fill="#fff100" d="M41 24.351A14 14 0 0 1 41 49.649Z" />
          </>
        )}
      </svg>
      <span className="wm-name">Truephase AI</span>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap stack-40">
        <div className="split" style={{ gap: 40 }}>
          <div className="stack-16">
            <span className="wordmark"><Logo tone="carbon" /></span>
            <p className="body-sm quiet prose">
              Automation and AI voice agents for UK clinics, care homes and salons. A UK
              company; where your data is processed is set out in our privacy notice.
            </p>
          </div>

          <nav className="grid-3" style={{ gap: 24 }} aria-label="Footer">
            <div className="stack-8 footer-group">
              <h2 className="mono quiet">Product</h2>
              <ul className="stack-8" role="list">
                <li><Link href="/#what">What it does</Link></li>
                <li><Link href="/#how">How it works</Link></li>
                <li><a href={PORTAL_URL}>Client portal</a></li>
              </ul>
            </div>
            <div className="stack-8 footer-group">
              <h2 className="mono quiet">Company</h2>
              <ul className="stack-8" role="list">
                <li><Link href="/#talk">Contact</Link></li>
                <li><Link href="/#who">Who it’s for</Link></li>
                <li><Link href="/#questions">Questions</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div className="stack-8 footer-group">
              <h2 className="mono quiet">Legal</h2>
              <ul className="stack-8" role="list">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
                <li><Link href="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <hr className="rule-dark" />

        <div className="stack-16">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="mono quiet">© {new Date().getFullYear()} Truephase AI</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mono">
              {CONTACT_EMAIL}
            </a>
          </div>
          {/* Companies Act 2006 s.82 and the Trading Disclosures Regulations 2008
              require these four facts on the website of every UK company. */}
          <p className="body-sm quiet prose">
            {COMPANY.legalName} is registered in {COMPANY.registeredIn}, company
            number {COMPANY.number}. Registered office: {COMPANY.registeredOffice}.
          </p>
        </div>
      </div>
    </footer>
  );
}
