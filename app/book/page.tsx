import type { Metadata } from "next";
import { SiteNav, SiteFooter, CONTACT_EMAIL } from "../_components/chrome";
import { SERVICES } from "../_data/services";
import { BookingWidget } from "./BookingWidget";

export const metadata: Metadata = {
  title: "Book a call — Truephase AI",
  description:
    "Book a free 30-minute video call with Truephase AI. Pick a day and a time that suits you, and we’ll send a Google Meet invite.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <div className="tp-site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteNav />

      <main id="main" tabIndex={-1}>
        <section className="wrap section bk-wrap">
          <div className="stack-24 bk-intro">
            <span className="tag">Free 30-minute call</span>
            <h1 className="display">Book a call</h1>
            <p className="subheading-lg muted prose">
              Pick a day, pick a time, tell us who you are. We’ll send a Google Meet invite
              to your email.
            </p>
          </div>

          <BookingWidget email={CONTACT_EMAIL} services={SERVICES.map((s) => s.title)} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
