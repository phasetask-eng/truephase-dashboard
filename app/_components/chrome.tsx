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
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:4173";

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
          <a href={PORTAL_URL} className="btn btn-ghost">
            <HoverLoop>Client login</HoverLoop>
          </a>
          <Magnetic>
            <a href="#talk" className="btn btn-filled">
              <HoverLoop>Book a call</HoverLoop>
            </a>
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
              Automation and AI voice agents for UK clinics, care homes and salons.
              Built and run in the United Kingdom.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 24 }}>
            <div className="stack-8">
              <span className="mono quiet">Product</span>
              <Link href="/#what">What it does</Link>
              <Link href="/#how">How it works</Link>
              <a href={PORTAL_URL}>Client portal</a>
            </div>
            <div className="stack-8">
              <span className="mono quiet">Company</span>
              <a href="#talk">Contact</a>
              <Link href="/#who">Who it’s for</Link>
              <Link href="/#questions">Questions</Link>
            </div>
            <div className="stack-8">
              <span className="mono quiet">Legal</span>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>

        <hr className="rule-dark" />

        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="mono quiet">© {new Date().getFullYear()} Truephase AI</span>
          <a href="mailto:support@truephase.co.uk" className="mono">
            support@truephase.co.uk
          </a>
        </div>
      </div>
    </footer>
  );
}
