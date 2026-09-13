import Link from "next/link";

const NAV = [
  { href: "/#what", label: "What it does" },
  { href: "/#how", label: "How it works" },
  { href: "/#who", label: "Who it’s for" },
  { href: "/#questions", label: "Questions" },
];

export function SiteNav() {
  return (
    <header className="nav-bar">
      <div className="wrap nav-inner">
        <Link href="/" className="wordmark" aria-label="Truephase — home">
          Truephase
        </Link>

        <nav className="nav-pill" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href="/dashboard" className="btn btn-ghost">
            Client login
          </Link>
          <a href="#talk" className="btn btn-filled">
            Book a call
          </a>
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
            <span className="wordmark">Truephase</span>
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
              <Link href="/dashboard">Client portal</Link>
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
          <span className="mono quiet">© {new Date().getFullYear()} Truephase</span>
          <a href="mailto:support@truephase.co.uk" className="mono">
            support@truephase.co.uk
          </a>
        </div>
      </div>
    </footer>
  );
}
