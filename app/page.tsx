import Link from "next/link";
import { SiteNav, SiteFooter, CONTACT_EMAIL, PORTAL_URL, BOOKING_URL } from "./_components/chrome";
import { Transcript } from "./_components/motion";
import { MotionProvider, HeroSequence, HoverLoop, Tilt, Magnetic } from "./_components/motion/index";
import { HeroLoop } from "./_components/motion/HeroLoop";
import { SERVICES } from "./_data/services";

/* ── content ─────────────────────────────────────────────── */

const TRANSCRIPT = [
  {
    who: "Agent",
    said: "Hi, you’ve reached the practice. I’m their AI assistant, and this call is recorded. How can I help?",
  },
  {
    who: "Caller",
    said: "Hi — I know you’re shut, I just wanted to see about getting in this week. I’ve cracked a filling.",
  },
  {
    who: "Agent",
    said: "That sounds uncomfortable — let’s get you seen. I can do Thursday at 8:20 in the morning, or there’s a cancellation slot tomorrow at 2:15.",
  },
  { who: "Caller", said: "Tomorrow at quarter past two would be brilliant." },
  {
    who: "Agent",
    said: "Booked. I’ll text you the confirmation now, and I’ve made a note for the practice that it’s a cracked filling so they’ll have the time set aside.",
  },
];

const DAY = [
  {
    time: "07:12",
    when: "Before you opened",
    title: "A patient moves Thursday",
    body: "They ring to shift an appointment. The agent finds the next slot that works, moves it, and sends the confirmation. Nobody had unlocked the door yet.",
    tag: "AI Receptionist",
  },
  {
    time: "09:58",
    when: "During the first surgery",
    title: "The enquiry that rings three practices",
    body: "A new patient, shopping around, booking with whoever picks up. Answered straight away and booked in before they got to the next number.",
    tag: "Appointment Scheduler",
  },
  {
    time: "12:40",
    when: "When it would have gone to voicemail",
    title: "A question it can’t answer",
    body: "So it stops trying. It takes the caller’s name and number, writes down what they wanted, and flags it. You rang back at two, knowing exactly what you were ringing about.",
    tag: "AI Receptionist",
  },
];

const DAY_LATE = [
  {
    time: "23:05",
    when: "Long after everyone went home",
    title: "Yesterday’s patient leaves five stars",
    body: "They open the review request on the sofa and write two lines. A reply is drafted and waiting for you to approve in the morning.",
    tag: "Review Management",
  },
  {
    time: "09:05",
    when: "Next morning, before you arrive",
    title: "The day is already written up",
    body: "Calls taken, appointments made, what needed a human and what didn’t. In your inbox and in your portal, every morning, without anyone compiling it.",
    tag: "Reports",
  },
];

const STEPS = [
  {
    n: "01",
    title: "We listen to how you work",
    body: "A call, then a look at how your front desk actually runs — what gets asked, what gets missed, what you would rather never do again.",
    who: "About an hour of your time",
  },
  {
    n: "02",
    title: "We build and test it",
    body: "We configure the agent, connect it to your number and your diary, and test it against real situations until it handles them the way you would.",
    who: "Truephase AI does this, not you",
  },
  {
    n: "03",
    title: "It goes live",
    body: "Your number starts being answered. You get a login where every call, transcript, booking and review sits, and a written report each day.",
    who: "You keep the login",
  },
];

const SECTORS = [
  {
    name: "Dental practices",
    note: "New patient enquiries, recalls, and cancellations that need refilling the same day.",
  },
  {
    name: "Physiotherapy clinics",
    note: "Self-pay enquiries that go cold if nobody rings back within the hour.",
  },
  {
    name: "Care homes",
    note: "Family enquiries at any hour, handled calmly and written up in full.",
  },
  {
    name: "Salons & clinics",
    note: "A chair sitting empty because the phone rang while you had your hands full.",
  },
];

const QUESTIONS = [
  {
    q: "Will callers know it’s not a person?",
    a: "Yes. Every call opens with a notice that it is recorded, and callers can ask for a person at any point and get one. We are adding ‘you’re speaking with the practice’s AI assistant’ to that opening line for every agent, in words you sign off, and it is never allowed to claim to be a person. Most callers do not mind at all — what they want is to be answered and dealt with.",
  },
  {
    q: "What happens when it can’t help?",
    a: "It stops trying. The call transfers to whoever you nominate, or it takes a message and flags it. An agent that guesses is worse than no agent, so ours hands over early.",
  },
  {
    q: "Do I have to change my phone system?",
    a: "No. Your existing number stays as it is — calls are forwarded to the agent, and you can turn that forwarding off whenever you like.",
  },
  {
    q: "Who can see the call transcripts?",
    a: "You and the people you give logins to. Truephase AI staff can access your account to support and configure it. Calls involve other people’s personal information, so how it is stored, who processes it and for how long is written down in our privacy notice, linked in the footer.",
  },
  {
    q: "What do I get on day one?",
    a: "A working agent on your number, a login to the portal, and a named person at Truephase AI. Not a trial you configure yourself.",
  },
];

/* ── page ────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <MotionProvider />
      <HeroSequence />
      <SiteNav />

      <main id="main" tabIndex={-1}>
        {/* ── HERO ─────────────────────────────────────────
            Two columns: the headline holds the left half, the object sits in
            the right half with clear air between them. The object is not in a
            card, a panel or any clipping container — it is a hero visual in
            its own grid cell. */}
        <section className="hero" data-hero>
          <div className="hero-copy">
            <span className="mono muted" data-hero-copy>
              UK · Clinics, care homes &amp; salons
            </span>

            {/* Breaks are explicit so SplitText masks the lines we designed,
                not whatever the viewport happens to wrap to. */}
            <h1 className="display-xl" data-hero-heading>
              Nobody{" "}
              <br />
              puts your{" "}
              <br />
              callers{" "}
              <br />
              on hold
            </h1>

            <p className="hero-sub muted" data-hero-copy>
              Truephase AI answers your phone, books the appointment and writes the day up.
              Below is one Tuesday, hour by hour.
            </p>

            <div className="row hero-cta" style={{ gap: 8 }} data-hero-copy>
              <Magnetic>
                <Link href={BOOKING_URL} className="btn btn-filled">
                  <HoverLoop>Book a call</HoverLoop>
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#day" className="btn btn-ghost">
                  <HoverLoop>Read the day</HoverLoop>
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="hero-media" data-hero-media>
            <HeroLoop
              webm="/hero-tower.webm"
              mp4="/hero-tower.mp4"
              still="/hero-tower-still.webp"
              width={1000}
              height={1000}
              label="Animated tower of coloured blocks, one layer per Truephase AI service: voice AI, booking, review management, automation, web design, AI video and chatbot. Layers slide out, rise and settle back on top in a slow loop."
            />
          </div>
        </section>

        {/* ── WHAT WE RUN ─────────────────────────────────── */}
        <section className="wrap section" id="what">
          <div className="stack-40">
            <div className="split" style={{ alignItems: "end" }} data-reveal>
              <h2 className="heading-lg">
                Six things
                <br />
                we run
                <br />
                for you
              </h2>
              <p className="subheading muted prose">
                Take one or take all six. Four run every day in the background; web and
                video are projects — booked in, built, handed over. Most practices start
                with the phone, because that is where the money is being lost, and add
                the rest once they trust it.
              </p>
            </div>

            <div className="grid-3 service-grid">
              {SERVICES.map((s) => (
                <Tilt key={s.slug} amount={5} className="tilt-cell" data-reveal>
                  <Link
                    href={`/services/${s.slug}`}
                    className={`card service-card${s.cardMedia ? " service-card-media" : ""}`}
                    aria-labelledby={`svc-${s.slug}`}
                  >
                    <span className="tag">{s.tag}</span>
                    <h3 id={`svc-${s.slug}`} className="heading-sm">
                      {s.title}
                    </h3>
                    {s.cardMedia ? (
                      <>
                        <div className="svc-media" role="img" aria-label={s.cardMedia.label}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="svc-media-img"
                            src={s.cardMedia.gif}
                            alt=""
                            width={864}
                            height={864}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <p className="sr-only">{s.body}</p>
                      </>
                    ) : (
                      <p className="body muted">{s.body}</p>
                    )}
                    <span className="svc-more">
                      {s.project ? "See the project" : "See how it works"}{" "}
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ───────────────────────────────── */}
        {/* A dark band: it sits straight after the white service cards, so the
            contrast is what separates the two grids. */}
        <section className="band-inverted" id="who" data-scrub>
          <div className="wrap stack-40">
            <div className="split" style={{ alignItems: "end" }} data-reveal>
              <h2 className="heading-lg">
                Built for places
                <br />
                where the phone
                <br />
                is the business
              </h2>
              <p className="subheading quiet prose">
                We work with a small number of UK practices at a time, because setting one
                up properly takes us longer than selling one does.
              </p>
            </div>

            <div className="grid-4">
              {SECTORS.map((s, i) => (
                <Tilt key={s.name} amount={6} className="tilt-cell" data-reveal>
                  <article className="sector-card stack-16">
                    <span className="sector-index">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="subheading-lg">{s.name}</h3>
                    <p className="body-sm muted">{s.note}</p>
                  </article>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* A scroll-driven cube section once sat here. Its frames were derived
            from third-party footage without a written licence, so the section,
            the frames and the tooling were removed. The Blender source for an
            original cube (blender/truephase_cube.blend) remains if it is ever
            wanted back. */}

        {/* ── THE DAY ────────────────────────────────────── */}
        <section className="wrap section" id="day">
          <div className="stack-16" style={{ marginBottom: 40 }} data-reveal>
            <span className="mono muted">One Tuesday · illustrative</span>
            <h2 className="heading-lg">
              Nothing here
              <br />
              needed you
            </h2>
          </div>

          <ol className="timeline" role="list">
            {DAY.map((item) => (
              <li className="tl-item" key={item.time} data-reveal>
                <div className="tl-time">
                  <span className="tl-clock">{item.time}</span>
                  <span className="mono tl-when">{item.when}</span>
                </div>
                <div className="tl-body">
                  <h3 className="heading-sm">{item.title}</h3>
                  <p className="body muted prose">{item.body}</p>
                  <span className="tag">{item.tag}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 19:42 — the climax, full bleed ─────────────── */}
        <section className="band-inverted" id="evening" data-scrub>
          <div className="wrap stack-40">
            <div className="split" style={{ alignItems: "end" }}>
              <div className="stack-16">
                <span className="mono quiet">19:42 · three hours after you closed</span>
                <h2 className="display">
                  The call
                  <br />
                  you never
                  <br />
                  knew about
                </h2>
              </div>
              <p className="subheading quiet prose">
                Your practice shut at six. The agent picked up straight away. Here is what
                one of those calls looks like — an illustrative transcript, alongside the
                booking it made, as it would appear in the portal next morning.
              </p>
            </div>

            <div className="card-inverted" style={{ padding: 0 }}>
              <div className="record-head">
                <span className="mono quiet">Inbound · 19:42 · 1m 48s</span>
                <span className="tag">Booked</span>
              </div>

              <Transcript lines={TRANSCRIPT} />

              <div className="record-foot">
                <span className="tag tag-dark">Appointment created</span>
                <span className="tag tag-dark">Confirmation sent</span>
                <span className="tag tag-dark">Note passed to practice</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE DAY, LATE ──────────────────────────────── */}
        <section className="wrap section" aria-labelledby="later-heading">
          <h2 id="later-heading" className="sr-only">
            Later that day
          </h2>
          <ol className="timeline" role="list">
            {DAY_LATE.map((item) => (
              <li className="tl-item" key={item.time} data-reveal>
                <div className="tl-time">
                  <span className="tl-clock">{item.time}</span>
                  <span className="mono tl-when">{item.when}</span>
                </div>
                <div className="tl-body">
                  <h3 className="heading-sm">{item.title}</h3>
                  <p className="body muted prose">{item.body}</p>
                  <span className="tag">{item.tag}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── SETUP ──────────────────────────────────────── */}
        <section className="wrap section" id="how">
          <div className="stack-40">
            <div className="stack-16" data-reveal>
              <span className="mono muted">Three steps · about two weeks</span>
              <h2 className="heading-lg">
                We set it up.
                <br />
                You don’t configure anything.
              </h2>
            </div>

            <div className="grid-3" style={{ alignItems: "stretch" }}>
              {STEPS.map((s, i) => (
                <Tilt key={s.n} amount={5} className="tilt-cell" data-reveal>
                <article
                  className={`card-arc stack-16 ${i === 1 ? "card-arc-dark" : ""}`}
                >
                  <span className="step-num">{s.n}</span>
                  <h3 className="heading-sm">{s.title}</h3>
                  <p className="body muted">{s.body}</p>
                  <span className="mono step-who">{s.who}</span>
                </article>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTAL ─────────────────────────────────────── */}
        <section className="wrap section">
          <Tilt amount={3} data-reveal>
          <div className="card-lg split" style={{ alignItems: "center", gap: 40 }}>
            <div className="stack-16">
              <span className="tag">Included</span>
              <h2 className="heading">Where that day is waiting for you</h2>
              <p className="body muted prose">
                Every client gets a login. Calls, transcripts, outcomes, reviews and the
                daily report in one place, updating as they happen — so you can check what
                your AI did last night without asking us.
              </p>
              <div className="row" style={{ gap: 8, paddingTop: 8 }}>
                <Magnetic>
                  <a href={PORTAL_URL} className="btn btn-filled">
                    <HoverLoop>Go to the client portal</HoverLoop>
                  </a>
                </Magnetic>
              </div>
            </div>

            <ul className="stack-8" role="list">
              {[
                "Every call, with the transcript",
                "Bookings the agent made",
                "Reviews, requests and replies",
                "A written report each morning",
                "Logins for your team",
              ].map((line) => (
                <li key={line} className="subheading portal-line">
                  {line}
                </li>
              ))}
            </ul>
          </div>
          </Tilt>
        </section>

        {/* ── QUESTIONS ──────────────────────────────────── */}
        <section className="wrap section" id="questions">
          <div className="stack-40">
            <h2 className="heading-lg" data-reveal>
              The questions
              <br />
              we actually get asked
            </h2>

            <div className="stack-16">
              {QUESTIONS.map((item) => (
                <Tilt key={item.q} amount={3} data-reveal>
                  <details className="card" style={{ borderRadius: 24 }}>
                    <summary className="subheading-lg">{item.q}</summary>
                    <p className="body muted prose" style={{ paddingTop: 16 }}>
                      {item.a}
                    </p>
                  </details>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* ── TALK ───────────────────────────────────────── */}
        <section className="band-inverted" id="talk" data-scrub>
          <div className="wrap stack-40">
            <h2 className="display" data-reveal>
              Tell us what
              <br />
              your phone
              <br />
              costs you
            </h2>

            <div className="split" style={{ alignItems: "end" }}>
              <p className="subheading quiet prose">
                One call, no deck. We will ask how many enquiries you think you miss in a
                week and tell you honestly whether we can help — and if we can’t, we’ll say
                so.
              </p>

              <div className="stack-16">
                <span className="mono quiet">Email us directly</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="heading email-link"
                  style={{ width: "fit-content" }}
                >
                  <span className="voltage">{CONTACT_EMAIL}</span>
                </a>
                <Magnetic>
                  <Link
                    href={BOOKING_URL}
                    className="btn btn-inverted"
                    style={{ width: "fit-content" }}
                  >
                    <HoverLoop>Pick a time for a call</HoverLoop>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
