import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, LegalTable } from "../_components/legal-doc";
import { CONTACT_EMAIL, COMPANY } from "../_components/chrome";

export const metadata: Metadata = {
  title: "Privacy notice — Truephase AI",
  description:
    "How Truephase AI Limited handles personal information: for callers to businesses that use our AI receptionist, for website visitors, and for our clients.",
};

const UPDATED = "3 October 2026";
const VERSION = "1.0";

export default function Privacy() {
  return (
    <LegalDoc
      title="Privacy notice"
      summary="How Truephase AI handles personal information, written so you can actually read it. It covers people who phone or message a business that uses our AI receptionist, people who visit this website, and the businesses we work for."
      version={VERSION}
      updated={UPDATED}
      currentPath="/privacy"
      inShort={[
        "If you rang a business and an AI answered, that business is responsible for your information. We handle it on their behalf and under their instructions.",
        "Calls are recorded and transcribed so the booking is right and the business can see what was said. You are told this at the start of the call.",
        "This website sets no cookies, runs no analytics and sends nothing to advertisers.",
        "We do not sell personal information, and we do not use callers’ conversations to train AI models.",
        "You can ask for a copy of your information or ask for it to be deleted. Email us and a person will reply within one month.",
      ]}
      sections={[
        {
          id: "who",
          heading: "Who we are",
          body: (
            <>
              <p>
                We are {COMPANY.legalName}, trading as {COMPANY.tradingName}. We are registered in{" "}
                {COMPANY.registeredIn} under company number {COMPANY.number}, and our registered
                office is {COMPANY.registeredOffice}.
              </p>
              <p>
                We run AI phone receptionists, chatbots, review management and automation for UK
                clinics, practices, salons, care homes and trades. For anything about personal
                information, email{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=Data%20request`}>{CONTACT_EMAIL}</a>{" "}
                with “Data request” in the subject line.
              </p>
            </>
          ),
        },
        {
          id: "callers",
          heading: "If you phoned, messaged or were texted by a business that uses Truephase AI",
          body: (
            <>
              <p>
                When you call a business that uses our service, an AI assistant answers. It is
                software, not a person. The opening message tells you that the call is recorded.
                You can ask for a person at any point, and the assistant will transfer you or take
                a message.
              </p>
              <h3>What is collected</h3>
              <ul>
                <li>Your phone number, and your name if you give it.</li>
                <li>
                  A recording of the call, a written transcript of it, and a short summary of what
                  you wanted and what happened.
                </li>
                <li>Appointment details you ask for or change.</li>
                <li>
                  Text messages sent to you on the business’s behalf (for example a booking link
                  or a review request), whether they were delivered, and whether a link was opened.
                </li>
                <li>
                  If you message the business on its website, WhatsApp, Instagram or Facebook, the
                  messages you send and the replies.
                </li>
              </ul>
              <h3>Who is responsible for it</h3>
              <p>
                The business you contacted decides why your information is collected and how it is
                used. In data protection terms it is the “controller”. We act on its written
                instructions as its “processor”: we provide the system, keep it secure and do not
                use your information for our own purposes. If you have a question or a request
                about your information, you can ask the business directly, or ask us and we will
                pass your request to them within two working days and help them answer it.
              </p>
              <h3>What it is used for</h3>
              <ul>
                <li>Answering your call, booking or changing your appointment, and taking messages.</li>
                <li>Letting the business see and check what was said and what was booked.</li>
                <li>Sending you the texts the business has asked us to send.</li>
                <li>
                  Checking the assistant is working properly. Staff at Truephase AI may read a
                  transcript or listen to a recording to fix a problem or improve how the assistant
                  handles a type of call. Conversations are not used to train AI models.
                </li>
              </ul>
              <h3>Sensitive information</h3>
              <p>
                If you call a clinic or practice you may mention your health. The assistant is set
                up to take only what is needed to book you in and to hand anything clinical to a
                person. What you say is still recorded and transcribed. If you would rather not say
                something to an AI, ask for a person.
              </p>
              <h3>Your choices</h3>
              <ul>
                <li>Ask for a person at any point in the call.</li>
                <li>
                  Reply STOP to any text message and you will not be sent another from that
                  business through our system.
                </li>
                <li>
                  Ask the business, or us, for a copy of your recording or transcript, or for it to
                  be deleted. See <a href="#rights">Your rights</a>.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "website",
          heading: "If you visit this website",
          body: (
            <>
              <p>
                This website sets no cookies and uses no analytics, advertising pixels or
                third-party scripts. The typefaces, images and video are served from our own
                domain. Our hosting provider, Vercel, handles each request and keeps standard
                server logs (your IP address, the page requested and the time) for security and
                to keep the site running. We do not combine those logs with anything else or use
                them to identify you.
              </p>
              <p>
                The only form on this site is the <Link href="/book">book a call</Link> page. When
                you book, we receive your name, email address and anything else you choose to add
                (business name, phone number, what you would like to talk about). We use it only
                to arrange and hold the call: it goes into our Google Calendar, which emails you
                the invitation. It is handled as an enquiry, as described in the next section.
                Neither the booking page nor anything else on the site sets cookies. See our{" "}
                <Link href="/cookies">cookie policy</Link> for the detail.
              </p>
            </>
          ),
        },
        {
          id: "enquiries",
          heading: "If you email us or talk to us about becoming a client",
          body: (
            <>
              <p>
                We keep your name, email address, phone number if you give it, the name of your
                business and what you wrote or told us. We use it to answer you, to prepare a
                proposal and, if you become a client, to set up and run the service. The legal
                basis is taking steps before a contract and performing it, and our legitimate
                interest in running the business.
              </p>
              <p>
                We do not buy or rent contact lists. If we write to you about our services and you
                would rather we did not, reply and say so and we will stop. We keep enquiry records
                for up to two years after our last contact with you, then delete them.
              </p>
            </>
          ),
        },
        {
          id: "clients",
          heading: "If you are a client, or use the client portal",
          body: (
            <>
              <p>
                To run your account we hold the business details and the names, email addresses
                and phone numbers of the people you give logins to, your settings, your billing
                history and a record of when each person signed in. The client portal keeps you
                signed in using a single strictly necessary entry in your browser’s local storage;
                it sets no tracking cookies.
              </p>
              <p>
                Named Truephase AI staff can open your account to support and configure it. When
                they do, they see what you see. We keep client records for the length of our
                agreement and for six years after it ends, because UK tax and company law require
                us to keep business records for that long. Your callers’ data is covered in the
                section above and is handled under the data processing terms in our{" "}
                <Link href="/terms">terms of service</Link>.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          heading: "Who we share information with",
          body: (
            <>
              <p>
                We use a small number of specialist companies to deliver the service. Each one
                works under a contract that limits what it may do with the information, and none
                of them may use it for their own purposes. We do not sell personal information.
              </p>
              <LegalTable
                caption="Service providers used by Truephase AI"
                head={["Provider", "What it does for us", "Information involved", "Where"]}
                rows={[
                  ["Supabase", "Database, file storage, logins", "All records listed in this notice", "Ireland (EU)"],
                  ["ElevenLabs", "The voice AI: understanding speech, replying, recording and transcribing calls", "Call audio, transcripts, phone numbers, what is said", "United States"],
                  ["Twilio", "Phone lines and some text messages", "Phone numbers, call connection details", "United States"],
                  ["ClickSend", "Text messages to callers", "Phone numbers, first names, message text", "Australia, with UK routing"],
                  ["n8n", "Automation between the systems above", "Booking details, names, phone numbers, report content", "Cloud service; region confirmed on request"],
                  ["OpenAI", "Short written insights for clients from aggregate figures", "Call counts, ratings and short review excerpts, not recordings", "United States"],
                  ["Google", "Calendar availability, Google Business Profile reviews and replies", "Appointment free/busy times, public review text", "United States"],
                  ["Wix", "Bookings and payments, for clients who use Wix", "Booking name, email, phone, service, payment status", "United States and Israel"],
                  ["Vercel", "Hosting this website and the client portal", "Web request logs", "United States"],
                ]}
              />
              <p>
                We may also share information when the law requires it, for example with a court
                or regulator, or to protect someone’s safety.
              </p>
            </>
          ),
        },
        {
          id: "transfers",
          heading: "Where information is stored",
          body: (
            <>
              <p>
                Our database and files are stored in Ireland, which UK law treats as providing
                adequate protection. Some providers above process information in the United States
                or elsewhere. Where that happens we rely on the safeguards UK law allows: an
                adequacy decision, the UK–US data bridge where the provider is certified under it,
                or the ICO’s international data transfer addendum. Ask us if you want a copy of the
                safeguard that applies to a particular provider.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          heading: "How long we keep information",
          body: (
            <>
              <LegalTable
                caption="Retention periods"
                head={["Information", "Kept for"]}
                rows={[
                  ["Call recordings, transcripts and summaries", "Up to two years from the call, unless the business we work for asks for a shorter period. After that, transcripts are deleted and phone numbers are shortened to their last three digits."],
                  ["Text messages and delivery records", "Up to two years"],
                  ["Appointment and booking records", "For as long as the business needs them to run its diary, within the two-year limit"],
                  ["Enquiries from prospective clients", "Up to two years after our last contact"],
                  ["Client account and billing records", "The length of the agreement plus six years"],
                  ["Website server logs", "Held by our hosting provider for a short rolling period, typically under 30 days"],
                ]}
              />
              <p>
                The service started in 2026, so nothing we hold is yet older than these periods.
                Automatic deletion runs to keep it that way.
              </p>
            </>
          ),
        },
        {
          id: "security",
          heading: "How we protect information",
          body: (
            <>
              <ul>
                <li>Everything travels over encrypted connections and is stored encrypted.</li>
                <li>
                  Each client’s records are separated in the database, so one business can never
                  see another’s callers.
                </li>
                <li>Access by our staff is limited to named people who need it to do their job.</li>
                <li>
                  Secrets such as API keys are held in a managed vault, not in code or on laptops.
                </li>
              </ul>
              <p>
                If a security incident affects your information we will tell the business we work
                for without undue delay so that it can meet its own duties, and we will tell the
                ICO where the law requires it.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          heading: "Your rights",
          body: (
            <>
              <p>
                You have the right to ask for a copy of the information we hold about you, to have
                mistakes corrected, to have it deleted, to limit how it is used, and to object to
                some uses. You also have the right to take a copy of information you gave us to
                another provider.
              </p>
              <p>
                To use any of these rights, email{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=Data%20request`}>{CONTACT_EMAIL}</a>{" "}
                with “Data request” in the subject. We reply within one month. We may ask you to
                confirm who you are first, for example by replying from the phone number the call
                came from. If your request is about a call to a business we work for, we will pass
                it to that business within two working days and help them answer it, because the
                decision is legally theirs.
              </p>
            </>
          ),
        },
        {
          id: "complaints",
          heading: "If you are not happy",
          body: (
            <>
              <p>
                Tell us first and we will try to put it right. You also have the right to complain
                to the UK regulator, the {COMPANY.ico.name}:{" "}
                <a href={COMPANY.ico.url}>ico.org.uk/make-a-complaint</a>, telephone 0303 123 1113.
              </p>
            </>
          ),
        },
        {
          id: "children",
          heading: "Children",
          body: (
            <p>
              Our services are for businesses and are not aimed at children. A child may of course
              ring a business that uses our service; their information is handled in the same way
              as anyone else’s and the business is responsible for it.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "Changes to this notice",
          body: (
            <p>
              When we change this notice we update the version number and date at the top and keep
              earlier versions available on request. If a change affects how your information is
              used in a way you would not expect, we will tell our clients directly so they can
              tell their callers.
            </p>
          ),
        },
      ]}
    />
  );
}
