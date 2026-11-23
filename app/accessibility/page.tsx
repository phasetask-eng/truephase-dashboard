import type { Metadata } from "next";
import { LegalDoc } from "../_components/legal-doc";
import { CONTACT_EMAIL } from "../_components/chrome";

export const metadata: Metadata = {
  title: "Accessibility statement — Truephase AI",
  description:
    "The standard this website is built to, what we have checked, what we know is not right yet, and how to tell us about a problem.",
};

const UPDATED = "3 October 2026";
const VERSION = "1.0";

export default function Accessibility() {
  return (
    <LegalDoc
      kicker="Accessibility"
      title="Accessibility statement"
      summary="We want everyone to be able to read this site and use the client portal, including people who use a screen reader, keyboard, magnification or reduced motion. This page says where we are and where we are not yet."
      version={VERSION}
      updated={UPDATED}
      currentPath="/accessibility"
      inShort={[
        "This website is built to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
        "Everything works with a keyboard, with a screen reader, at 200% zoom and with reduced motion switched on. The moving hero picture can be paused.",
        "The client portal is behind on a few points, listed below, and we are fixing them.",
        "If something does not work for you, email us and we will send you the content in another format and fix the problem.",
      ]}
      sections={[
        {
          id: "standard",
          heading: "The standard we work to",
          body: (
            <p>
              The Equality Act 2010 asks service providers to anticipate the needs of disabled
              people and make reasonable adjustments. The way we meet that for a website is WCAG
              2.2, level AA, which is the same standard UK public bodies must meet. We treat it as
              a floor, not a target.
            </p>
          ),
        },
        {
          id: "done",
          heading: "What this website does",
          body: (
            <ul>
              <li>Every page has a skip link, proper headings and landmarks, and a single main heading.</li>
              <li>All text meets the 4.5:1 contrast minimum; the lowest pair on the site is 4.67:1.</li>
              <li>Every link, button and disclosure shows a visible focus ring when you use a keyboard.</li>
              <li>
                Motion respects your system’s reduced-motion setting: the hero becomes a still
                picture, smooth scrolling and reveal animations are switched off, and the page is
                fully readable without JavaScript. The hero animation also has its own pause
                button for everyone else.
              </li>
              <li>Text is sized in units that scale with your browser settings, and nothing stops you zooming.</li>
              <li>The site has no forms, time limits, flashing content or audio.</li>
            </ul>
          ),
        },
        {
          id: "known",
          heading: "What we know is not right yet",
          body: (
            <ul>
              <li>
                On screens narrower than 1000 pixels the section links leave the top bar. They are
                still available in the footer. We are adding a compact menu.
              </li>
              <li>
                Some decorative borders are low-contrast by design. They do not carry information,
                but we are reviewing the ones around clickable cards.
              </li>
            </ul>
          ),
        },
        {
          id: "portal",
          heading: "The client portal",
          body: (
            <>
              <p>
                The client portal is a separate application for our clients. Its login and settings
                screens have been reviewed against the same standard. We have fixed form labels,
                error announcements, icon button names and the colour of the phone-size navigation.
                These items remain open and are being worked through:
              </p>
              <ul>
                <li>Pop-up dialogs do not yet trap keyboard focus or return it when they close.</li>
                <li>Some call rows expand on click only and are not yet reachable with the keyboard.</li>
                <li>Some labels on phone screens are smaller than we would like.</li>
                <li>Live updates can redraw a page and move your focus.</li>
              </ul>
            </>
          ),
        },
        {
          id: "contact",
          heading: "Tell us about a problem",
          body: (
            <p>
              If you cannot use part of this site or the portal, or you need information in a
              different format such as large print or plain text, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}?subject=Accessibility`}>{CONTACT_EMAIL}</a> with
              “Accessibility” in the subject. A person will reply within five working days and we
              will send you what you need. Tell us which page and what went wrong, and which
              browser or assistive technology you were using if you know it.
            </p>
          ),
        },
        {
          id: "enforcement",
          heading: "If you are not satisfied",
          body: (
            <p>
              If you are unhappy with how we respond, the Equality Advisory and Support Service
              (EASS) advises on the Equality Act in England, Scotland and Wales:{" "}
              <a href="https://www.equalityadvisoryservice.com/">equalityadvisoryservice.com</a>,
              telephone 0808 800 0082.
            </p>
          ),
        },
        {
          id: "testing",
          heading: "How this was tested",
          body: (
            <p>
              This statement was prepared on {UPDATED}. The site was reviewed by reading every page
              template and stylesheet against WCAG 2.2, by calculating colour contrast for every
              text and control colour pair, and by checking keyboard and reduced-motion behaviour
              in a desktop browser. We will re-test after any significant change and at least once
              a year.
            </p>
          ),
        },
      ]}
    />
  );
}
