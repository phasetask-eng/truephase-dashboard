import Link from "next/link";
import { SiteNav, SiteFooter } from "./_components/chrome";

/* ── content ─────────────────────────────────────────────── */

const SERVICES = [
  {
    tag: "Voice",
    title: "AI Receptionist",
    body: "Answers the phone on the first ring, day or night. Takes the caller’s name and number, understands what they want, books them in or passes them to you.",
    detail: ["Inbound and outbound", "Full transcript of every call", "Out-of-hours cover"],
  },
  {
    tag: "Booking",
    title: "Appointment Scheduler",
    body: "Turns a phone call into a booking without anyone typing it in. Confirmations and reminders go out on their own.",
    detail: ["Books during the call", "Reminders by text", "Cancellations handled"],
  },
  {
    tag: "Reputation",
    title: "Review Management",
    body: "Sends the review request at the right moment, tracks who opened it, and drafts a reply to every review that lands.",
    detail: ["Request after the visit", "Open and click tracking", "Drafted replies"],
  },
  {
    tag: "Back office",
    title: "Task Automation",
    body: "The repetitive work behind the front desk — chasing, filing, following up, writing the day up — handled without you.",
    detail: ["Daily written report", "Follow-up sequences", "Built to your process"],
  },
];

const STEPS = [
  {
    n: "01",
    title: "We listen to how you work",
    body: "A call, then a look at how your front desk actually runs today — what gets asked, what gets missed, what you would rather never do again.",
    who: "About an hour of your time",
  },
  {
    n: "02",
    title: "We build and test it",
    body: "We configure the voice agent, connect it to your number and your diary, and test it against real situations until it handles them the way you would.",
    who: "Truephase does this, not you",
  },
  {
    n: "03",
    title: "It goes live and you watch it work",
    body: "Your number starts being answered. You get a login to the portal where every call, transcript, booking and review sits, and a written report each day.",
    who: "You keep the login",
  },
];

const SECTORS = [
  { name: "Dental practices", note: "New patient enquiries, recalls, cancellations that need refilling the same day." },
  { name: "Physiotherapy clinics", note: "Self-pay enquiries that go cold if nobody rings back within the hour." },
  { name: "Care homes", note: "Family enquiries at any hour, handled calmly and written up in full." },
  { name: "Salons & clinics", note: "A chair sitting empty because the phone rang while you had your hands full." },
];

const QUESTIONS = [
  {
    q: "Will callers know it’s not a person?",
    a: "Most people work it out, and in practice they mind far less than you would expect — what they actually want is to be answered and dealt with. We tell you exactly what your agent says and you sign it off before it ever picks up.",
  },
  {
    q: "What happens when it can’t help?",
    a: "It stops trying. The call transfers to whoever you nominate, or it takes a message and flags it. An agent that guesses is worse than no agent, so ours is built to hand over early.",
  },
  {
    q: "Do I have to change my phone system?",
    a: "No. Your existing number stays exactly as it is — calls are forwarded to the agent, and you can turn that forwarding off whenever you like.",
  },
  {
    q: "Who can see the call transcripts?",
    a: "You and the people you give logins to. Truephase staff can access your account to support and configure it. Calls involve other people’s personal information, so if you want the detail of how that is handled, ask us and we will put it in writing.",
  },
  {
    q: "What do I get on day one?",
    a: "A working agent on your number, a login to the portal, and a named person at Truephase. Not a trial you configure yourself.",
  },
];

/* ── page ────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        {/* ── HERO ───────────────────────────────────────── */}
        <section className="wrap hero-grid">
          <div className="stack-24">
            <span className="mono muted">UK · Clinics, care homes & salons</span>

            <h1 className="display-xl">
              Nobody
              <br />
              puts your
              <br />
              callers
              <br />
              on hold
            </h1>

            <p className="subheading-lg muted prose">
              Truephase answers your phone, books the appointment, chases the review and
              writes the day up. You get the login, the transcripts and the evidence.
            </p>

            <div className="row" style={{ gap: 8, paddingTop: 8 }}>
              <a href="#talk" className="btn btn-filled">
                Book a call
              </a>
              <a href="#what" className="btn btn-ghost">
                See what it does
              </a>
            </div>
          </div>

          {/*
            Reserved slot for the hero 3D product render.
            Art direction and the generation prompt: public/hero-asset-prompt.txt
            Deliberately NOT a CSS imitation of a photoreal render.
          */}
          <figure className="asset-slot" aria-label="Hero product render — pending">
            <svg viewBox="0 0 100 100" fill="none" stroke="#979797" strokeWidth="1.5" aria-hidden="true">
              <path d="M50 8 L88 28 L88 72 L50 92 L12 72 L12 28 Z" />
              <path d="M50 8 L50 50 M50 50 L88 28 M50 50 L12 28 M50 50 L50 92" />
              <circle cx="88" cy="28" r="5" fill="#d1ffca" stroke="none" />
              <circle cx="12" cy="72" r="4" fill="#fff100" stroke="none" />
            </svg>
            <figcaption className="mono quiet">
              Hero render · 1:1 · pending generation
            </figcaption>
          </figure>
        </section>

        {/* ── PROOF: a real call, in the brutalist voice ──── */}
        <section className="band-inverted" id="proof">
          <div className="wrap stack-40">
            <div className="split" style={{ alignItems: "end" }}>
              <h2 className="display">
                This is
                <br />
                a Tuesday
                <br />
                at 7:42pm
              </h2>
              <p className="subheading quiet prose">
                Your practice closed at six. The agent picked up on the first ring, and
                this is what your portal showed you the next morning — every word of it,
                alongside the booking it made.
              </p>
            </div>

            <div className="card-inverted" style={{ padding: 0 }}>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "24px 0",
                  borderBottom: "1px solid var(--color-graphite)",
                }}
              >
                <span className="mono quiet">Inbound · 19:42 · 1m 48s</span>
                <span className="tag">Booked</span>
              </div>

              <div>
                <div className="record-line">
                  <span className="mono who">Caller</span>
                  <p className="said">
                    Hi — I know you’re shut, I just wanted to see about getting in this
                    week. I’ve cracked a filling.
                  </p>
                </div>
                <div className="record-line">
                  <span className="mono who">Agent</span>
                  <p className="said">
                    That sounds uncomfortable — let’s get you seen. I can do Thursday at
                    8:20 in the morning, or there’s a cancellation slot tomorrow at 2:15.
                  </p>
                </div>
                <div className="record-line">
                  <span className="mono who">Caller</span>
                  <p className="said">Tomorrow at quarter past two would be brilliant.</p>
                </div>
                <div className="record-line">
                  <span className="mono who">Agent</span>
                  <p className="said">
                    Booked. I’ll text you the confirmation now, and I’ve made a note for
                    the practice that it’s a cracked filling so they’ll have the time set
                    aside.
                  </p>
                </div>
              </div>

              <div
                className="row"
                style={{
                  gap: 8,
                  padding: "24px 0 0",
                  borderTop: "1px solid var(--color-graphite)",
                }}
              >
                <span className="tag tag-dark">Appointment created</span>
                <span className="tag tag-dark">Confirmation sent</span>
                <span className="tag tag-dark">Note passed to practice</span>
              </div>
            </div>

            <p className="body-sm quiet">
              Illustrative of a typical out-of-hours call. Real transcripts sit in your
              own portal.
            </p>
          </div>
        </section>

        {/* ── WHAT IT DOES ───────────────────────────────── */}
        <section className="wrap section" id="what">
          <div className="stack-40">
            <div className="split" style={{ alignItems: "end" }}>
              <h2 className="heading-lg">Four jobs,
                <br />
                off your desk</h2>
              <p className="subheading muted prose">
                Take one or take all four. Most practices start with the phone, because
                that is where the money is being lost, and add the rest once they trust it.
              </p>
            </div>

            <div className="grid-2">
              {SERVICES.map((s) => (
                <article key={s.title} className="card stack-16">
                  <span className="tag">{s.tag}</span>
                  <h3 className="heading-sm">{s.title}</h3>
                  <p className="body muted">{s.body}</p>
                  <hr className="rule" />
                  <ul className="stack-8">
                    {s.detail.map((d) => (
                      <li key={d} className="body-sm muted">
                        {d}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <section className="wrap section" id="how">
          <div className="stack-40">
            <div className="stack-16">
              <span className="mono muted">Three steps · about two weeks</span>
              <h2 className="heading-lg">We set it up.
                <br />
                You don’t configure anything.</h2>
            </div>

            <div className="grid-3" style={{ gap: 16, alignItems: "stretch" }}>
              {STEPS.map((s, i) => (
                <article
                  key={s.n}
                  className={`card-arc stack-16 ${i === 1 ? "card-arc-dark" : ""}`}
                >
                  <span className="step-num">{s.n}</span>
                  <h3 className="heading-sm">{s.title}</h3>
                  <p className="body" style={{ color: i === 1 ? "var(--color-smoke)" : "var(--color-slate)" }}>
                    {s.body}
                  </p>
                  <span className="mono" style={{ color: i === 1 ? "var(--color-mint-chip)" : "var(--color-slate)" }}>
                    {s.who}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ───────────────────────────────── */}
        <section className="wrap section" id="who">
          <div className="stack-40">
            <div className="split" style={{ alignItems: "end" }}>
              <h2 className="heading-lg">Built for places
                <br />
                where the phone
                <br />
                is the business</h2>
              <p className="subheading muted prose">
                We work with a small number of UK practices at a time, because setting one
                up properly takes us longer than selling one does.
              </p>
            </div>

            <div className="grid-4">
              {SECTORS.map((s) => (
                <article key={s.name} className="card stack-16" style={{ borderRadius: 24 }}>
                  <h3 className="subheading-lg">{s.name}</h3>
                  <p className="body-sm muted">{s.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTAL ─────────────────────────────────────── */}
        <section className="wrap section">
          <div className="card-lg split" style={{ alignItems: "center", gap: 40 }}>
            <div className="stack-16">
              <span className="tag">Included</span>
              <h2 className="heading">Your own portal, not a monthly PDF</h2>
              <p className="body muted prose">
                Every client gets a login. Calls, transcripts, outcomes, reviews and the
                daily report all sit in one place, updating as they happen — so you can
                check what your AI did last night without asking us.
              </p>
              <div className="row" style={{ gap: 8, paddingTop: 8 }}>
                <Link href="/dashboard" className="btn btn-filled">
                  Look inside the portal
                </Link>
              </div>
            </div>

            <ul className="stack-8">
              {[
                "Every call, with the transcript",
                "Bookings the agent made",
                "Reviews, requests and replies",
                "A written report each morning",
                "Logins for your team",
              ].map((line) => (
                <li
                  key={line}
                  className="subheading"
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-ash)",
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── QUESTIONS ──────────────────────────────────── */}
        <section className="wrap section" id="questions">
          <div className="stack-40">
            <h2 className="heading-lg">The questions
              <br />
              we actually get asked</h2>

            <div className="stack-16">
              {QUESTIONS.map((item) => (
                <details key={item.q} className="card" style={{ borderRadius: 24 }}>
                  <summary
                    className="subheading-lg"
                    style={{ cursor: "pointer", listStyle: "none" }}
                  >
                    {item.q}
                  </summary>
                  <p className="body muted prose" style={{ paddingTop: 16 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── TALK ───────────────────────────────────────── */}
        <section className="band-inverted" id="talk">
          <div className="wrap stack-40">
            <h2 className="display">
              Tell us what
              <br />
              your phone
              <br />
              costs you
            </h2>

            <div className="split" style={{ alignItems: "end" }}>
              <p className="subheading quiet prose">
                One call, no deck. We will ask how many enquiries you think you miss in a
                week and tell you honestly whether we can help — and if we can’t, we’ll
                say so.
              </p>

              <div className="stack-16">
                <span className="mono quiet">Email us directly</span>
                <a
                  href="mailto:support@truephase.co.uk"
                  className="heading email-link"
                  style={{ width: "fit-content" }}
                >
                  <span className="voltage">support@truephase.co.uk</span>
                </a>
                <a href="mailto:support@truephase.co.uk" className="btn btn-inverted" style={{ width: "fit-content" }}>
                  Book a call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
