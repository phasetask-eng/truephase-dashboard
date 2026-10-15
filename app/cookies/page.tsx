import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, LegalTable } from "../_components/legal-doc";
import { CONTACT_EMAIL } from "../_components/chrome";

export const metadata: Metadata = {
  title: "Cookie policy — Truephase AI",
  description:
    "This website sets no cookies. How we measure visits without them, what the client portal stores in your browser, and why no consent banner is needed.",
};

const UPDATED = "13 October 2026";
const VERSION = "1.1";

export default function Cookies() {
  return (
    <LegalDoc
      title="Cookie policy"
      summary="What this website and the client portal store in your browser. The short answer is: almost nothing."
      version={VERSION}
      updated={UPDATED}
      currentPath="/cookies"
      inShort={[
        "This website sets no cookies at all.",
        "We count visits and measure page speed with our host Vercel’s cookie-free tools. They do not identify you. There is no advertising pixel and no third-party script.",
        "The client portal stores one thing: the entry that keeps you signed in. It is strictly necessary, so no banner is required.",
        "If we ever add anything that needs your consent, we will update this page first and ask you.",
      ]}
      sections={[
        {
          id: "what",
          heading: "What a cookie is",
          body: (
            <p>
              A cookie is a small piece of text a website asks your browser to keep, so the site
              can recognise you next time. “Local storage” is a similar mechanism that websites
              use for the same purpose. UK law (the Privacy and Electronic Communications
              Regulations) says we need your consent to store or read anything on your device
              unless it is strictly necessary to provide a service you asked for.
            </p>
          ),
        },
        {
          id: "website",
          heading: "This website",
          body: (
            <>
              <p>
                truephase.co.uk sets no cookies. It uses no advertising or social-media scripts,
                and it loads no fonts, images or video from anyone else’s servers. To see how the
                site is used and how fast it loads, we use Vercel Web Analytics and Speed
                Insights. They run from our own domain, set no cookies and record visits without
                identifying you; our <Link href="/privacy">privacy notice</Link> lists what they
                record. Our hosting provider, Vercel, serves the pages
                and keeps standard server logs for security, as described in our{" "}
                <Link href="/privacy">privacy notice</Link>.
              </p>
              <p>
                We have checked this in the code and on the live site, and we have set the site up
                so that any new third-party script would be blocked until someone deliberately
                allows it.
              </p>
            </>
          ),
        },
        {
          id: "portal",
          heading: "The client portal",
          body: (
            <>
              <p>
                The client portal is a separate application for our clients, at a different web
                address. It stores the following in your browser:
              </p>
              <LegalTable
                caption="Storage used by the client portal"
                head={["Name", "What it is for", "Type", "How long"]}
                rows={[
                  [
                    "An entry beginning “sb-” in local storage",
                    "Keeps you signed in and refreshes your session securely",
                    "Strictly necessary",
                    "Until you sign out, or the session expires",
                  ],
                ]}
              />
              <p>
                The portal loads its typefaces from Google Fonts and one code library from the
                jsDelivr content network. Your browser sends your IP address to those services to
                fetch the files. Neither sets a cookie. We plan to serve these files from our own
                domain, after which the portal will contact only our own systems.
              </p>
            </>
          ),
        },
        {
          id: "no-banner",
          heading: "Why there is no cookie banner",
          body: (
            <p>
              A banner is required when a site wants to store or read something that is not
              strictly necessary, such as tracking or advertising cookies. This website sets no
              cookies, its visit counting identifies no one, and the portal stores only what it
              needs to keep you signed in. There is
              nothing to consent to, so we do not ask.
            </p>
          ),
        },
        {
          id: "control",
          heading: "Controlling cookies and storage",
          body: (
            <>
              <p>
                You can clear or block cookies and local storage in your browser settings. If you
                block storage for the client portal you will not be able to stay signed in. Help
                for the main browsers:
              </p>
              <ul>
                <li>
                  <a href="https://support.google.com/chrome/answer/95647">Google Chrome</a>
                </li>
                <li>
                  <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac">Apple Safari</a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "changes",
          heading: "Changes",
          body: (
            <p>
              If we add anything that stores or reads information on your device, we will update
              this page first, change the version and date at the top, and ask for consent where
              the law requires it. Questions go to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
