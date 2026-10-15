"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Day = { date: string; slots: string[] };
type Booked = { when: string; email: string };

const TZ = "Europe/London";

/* "2026-10-13" → a Date at midday UTC, so the day never slips across midnight. */
function noon(date: string) {
  return new Date(`${date}T12:00:00Z`);
}
function dayParts(date: string) {
  const d = noon(date);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: TZ }),
    day: d.toLocaleDateString("en-GB", { day: "numeric", timeZone: TZ }),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: TZ }),
    long: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }),
  };
}
/* "09:00" → "9:00am" */
function niceTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}
function plus30(t: string) {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + 30;
  return niceTime(`${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`);
}
function relative(date: string) {
  const todayLondon = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const n = Math.round((noon(date).getTime() - noon(todayLondon).getTime()) / 86400000);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  return null;
}

const PARTS = [
  { label: "Morning", test: (t: string) => Number(t.slice(0, 2)) < 12 },
  { label: "Afternoon", test: (t: string) => Number(t.slice(0, 2)) >= 12 && Number(t.slice(0, 2)) < 17 },
  { label: "Evening", test: (t: string) => Number(t.slice(0, 2)) >= 17 },
];

/* `services` is every service title on the site; the dropdown adds "Other". */
export function BookingWidget({ email, services }: { email: string; services: string[] }) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [booked, setBooked] = useState<Booked | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const timesRef = useRef<HTMLDivElement>(null);

  async function load(keepChoice = false, fresh = false) {
    setLoadError("");
    try {
      /* The free times are cached for a minute at the edge so the calendar
         shows at once. "fresh" skips that copy, for after a time was taken. */
      const url = fresh ? `/api/booking/slots?fresh=${Date.now()}` : "/api/booking/slots";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      const list: Day[] = data.days ?? [];
      setDays(list);
      if (!keepChoice || !list.some((d) => d.date === date)) {
        setDate(list[0]?.date ?? "");
        setTime("");
      }
    } catch {
      setLoadError("We could not load the free times just now.");
      setDays([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = useMemo(() => days?.find((d) => d.date === date), [days, date]);

  function pickDay(d: string) {
    setDate(d);
    setTime("");
    setFormError("");
  }
  function pickTime(t: string) {
    setTime(t);
    setFormError("");
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const f = new FormData(e.currentTarget);
    const payload = {
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      business: String(f.get("business") ?? ""),
      phone: String(f.get("phone") ?? ""),
      topic,
      notes: String(f.get("notes") ?? ""),
      website: String(f.get("website") ?? ""),
      date,
      time,
    };
    setSending(true);
    setFormError("");
    try {
      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setBooked({ when: data.when, email: data.email });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setFormError(data.error || "Sorry, something went wrong. Please try again.");
        if (data.taken) {
          setTime("");
          load(true, true);
          timesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch {
      setFormError(`Sorry, something went wrong. Please try again, or email ${email}.`);
    } finally {
      setSending(false);
    }
  }

  /* ── booked ─────────────────────────────────────────── */
  if (booked) {
    return (
      <div className="bk-card bk-done" role="status" aria-live="polite">
        <span className="bk-tick" aria-hidden="true">✓</span>
        <h2 className="heading-lg">You’re booked in</h2>
        <p className="subheading-lg">{booked.when} (UK time)</p>
        <p className="subheading muted prose">
          We’ve sent a calendar invite with a Google Meet link to{" "}
          <strong>{booked.email}</strong>. If it isn’t in your inbox in a few minutes, check your
          spam folder or email <a href={`mailto:${email}`}>{email}</a>.
        </p>
        <Link href="/" className="btn btn-filled" style={{ width: "fit-content" }}>
          Back to the home page
        </Link>
      </div>
    );
  }

  /* ── loading / error ────────────────────────────────── */
  if (days === null) {
    return (
      <div className="bk-card" aria-busy="true">
        <p className="mono quiet">Loading free times…</p>
        <div className="bk-days" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="bk-day bk-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError || days.length === 0) {
    return (
      <div className="bk-card stack-16">
        <p className="subheading-lg">
          {loadError || "There are no free times in the next two weeks."}
        </p>
        <p className="subheading muted">
          Please email <a href={`mailto:${email}`}>{email}</a> and we’ll find a time that works.
        </p>
        {loadError ? (
          <button type="button" className="btn btn-ghost" style={{ width: "fit-content" }} onClick={() => load()}>
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  const chosen = date ? dayParts(date) : null;

  return (
    <div className="bk-card">
      {/* step 1 */}
      <section className="bk-step" aria-labelledby="bk-step-day">
        <h2 id="bk-step-day" className="bk-step-title">
          <span className="bk-num">1</span> Choose a day
        </h2>
        <div className="bk-days" role="group" aria-label="Available days">
          {days.map((d) => {
            const p = dayParts(d.date);
            const rel = relative(d.date);
            const on = d.date === date;
            return (
              <button
                key={d.date}
                type="button"
                className={`bk-day${on ? " is-on" : ""}`}
                aria-pressed={on}
                aria-label={`${p.long}, ${d.slots.length} times free`}
                onClick={() => pickDay(d.date)}
              >
                <span className="bk-day-wk">{rel ?? p.weekday}</span>
                <span className="bk-day-num">{p.day}</span>
                <span className="bk-day-mo">{p.month}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* step 2 */}
      {current ? (
        <section className="bk-step" aria-labelledby="bk-step-time" ref={timesRef}>
          <h2 id="bk-step-time" className="bk-step-title">
            <span className="bk-num">2</span> Choose a time
            <span className="bk-step-note">{chosen?.long} · UK time</span>
          </h2>
          <div className="stack-16">
            {PARTS.map((part) => {
              const slots = current.slots.filter(part.test);
              if (!slots.length) return null;
              return (
                <div key={part.label} className="bk-part">
                  <span className="mono quiet">{part.label}</span>
                  <div className="bk-times" role="group" aria-label={`${part.label} times`}>
                    {slots.map((t) => {
                      const on = t === time;
                      return (
                        <button
                          key={t}
                          type="button"
                          className={`bk-time${on ? " is-on" : ""}`}
                          aria-pressed={on}
                          onClick={() => pickTime(t)}
                        >
                          {niceTime(t)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* step 3 */}
      <div ref={formRef}>
        {time && chosen ? (
          <section className="bk-step" aria-labelledby="bk-step-you">
            <h2 id="bk-step-you" className="bk-step-title">
              <span className="bk-num">3</span> Your details
            </h2>

            <div className="bk-summary">
              <div>
                <span className="mono quiet">Your call</span>
                <p className="subheading-lg">
                  {chosen.long}, {niceTime(time)} – {plus30(time)}
                </p>
                <p className="body-sm muted">30 minutes · Google Meet video call · UK time</p>
              </div>
              <button type="button" className="btn-text body-sm" onClick={() => setTime("")}>
                Change
              </button>
            </div>

            <form className="bk-form" onSubmit={submit} noValidate={false}>
              <div className="bk-row">
                <label className="bk-field">
                  <span>Your name *</span>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
                </label>
                <label className="bk-field">
                  <span>Email *</span>
                  <input name="email" type="email" required maxLength={120} autoComplete="email" />
                </label>
              </div>
              <div className="bk-row">
                <label className="bk-field">
                  <span>Business name</span>
                  <input name="business" maxLength={120} autoComplete="organization" />
                </label>
                <label className="bk-field">
                  <span>Phone</span>
                  <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
                </label>
              </div>
              <label className="bk-field">
                <span>What would you like to talk about? *</span>
                <select
                  name="topic"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </label>
              {topic === "Other" ? (
                <label className="bk-field">
                  <span>Tell us a little about it *</span>
                  <textarea name="notes" rows={3} maxLength={1000} required />
                </label>
              ) : null}
              {/* left empty by people; filled in by spam bots */}
              <label className="bk-hp" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              {formError ? (
                <p className="bk-error" role="alert">
                  {formError}
                </p>
              ) : null}

              <button type="submit" className="btn btn-filled bk-submit" disabled={sending}>
                {sending ? "Booking…" : "Confirm booking"}
              </button>
              <p className="body-sm quiet">
                We use these details only to arrange and hold the call. See our{" "}
                <Link href="/privacy#enquiries">privacy notice</Link>.
              </p>
            </form>
          </section>
        ) : null}
      </div>

      {formError && !time ? (
        <p className="bk-error" role="alert">
          {formError}
        </p>
      ) : null}
    </div>
  );
}
