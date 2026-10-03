import Link from "next/link";
import { HoverLoop, Magnetic } from "./motion/index";

const NAV = [
  { href: "/#what", label: "What it does" },
  { href: "/#how", label: "How it works" },
  { href: "/#who", label: "Who it’s for" },
  { href: "/#questions", label: "Questions" },
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
          <span className="wm-t">T</span>ruephase AI
        </Link>

        <nav className="nav-pill" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              <HoverLoop>{item.label}</HoverLoop>
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Two labels, one shown at a time: the narrowest phones get "Log in"
              because "Client login" and "Book a call" do not both fit there.
              The hidden one is display:none, so it is not read out either. */}
          <a href={PORTAL_URL} className="btn btn-ghost">
            <HoverLoop className="nav-login-full">Client login</HoverLoop>
            <HoverLoop className="nav-login-short">Log in</HoverLoop>
          </a>
          <Magnetic>
            <Link href="/#talk" className="btn btn-filled">
              <HoverLoop>Book a call</HoverLoop>
            </Link>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap stack-40">
        <div className="split" style={{ gap: 40 }}>
          <div className="stack-16">
            <span className="wordmark"><span className="wm-t">T</span>ruephase AI</span>
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
