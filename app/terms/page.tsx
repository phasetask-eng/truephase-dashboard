import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "../_components/legal-doc";
import { CONTACT_EMAIL, COMPANY } from "../_components/chrome";

export const metadata: Metadata = {
  title: "Terms of service — Truephase AI",
  description:
    "The plain-English agreement between Truephase AI Limited and the businesses it works for.",
};

const UPDATED = "3 October 2026";
const VERSION = "1.0";

export default function Terms() {
  return (
    <LegalDoc
      title="Terms of service"
      summary="The agreement between Truephase AI Limited and the businesses we work for. Your order form sets the specifics: which services, the price and the start date. These terms cover everything else."
      version={VERSION}
      updated={UPDATED}
      currentPath="/terms"
      inShort={[
        "We set up and run the services named in your order. You pay the fee in your order, monthly in advance, plus VAT where it applies.",
        "The receptionist is an AI. It is good, it is not perfect, and it is never a substitute for emergency or clinical advice. Anything it cannot handle goes to a person.",
        "You stay responsible for your callers and their information. We handle it only on your instructions, and the data protection terms below are part of this agreement.",
        "Either of us can end the agreement with thirty days’ notice. You can take a copy of your data on the way out.",
        "Our liability is capped at the fees you paid us in the twelve months before a claim, except where the law does not allow a cap.",
      ]}
      sections={[
        {
          id: "parties",
          heading: "Who this agreement is between",
          body: (
            <>
              <p>
                “We” and “us” means {COMPANY.legalName}, trading as {COMPANY.tradingName},
                registered in {COMPANY.registeredIn} under company number {COMPANY.number},
                registered office {COMPANY.registeredOffice}. “You” means the business named in
                the order form. These terms, your order form and the data processing terms in
                section 7 together make up the agreement. If the order form says something
                different from these terms, the order form wins.
              </p>
              <p>
                Our services are for businesses. By signing an order form or using the client
                portal you confirm you are acting for a business and that the person signing has
                the authority to do so.
              </p>
            </>
          ),
        },
        {
          id: "service",
          heading: "What we provide",
          body: (
            <>
              <p>
                We provide the services named in your order from the list on this site: the AI
                receptionist, chatbot, review management, task automation, web design and AI video.
                For the services that run every day we configure them, connect them to your number,
                diary and accounts, test them with you and keep them running. Web design and video
                are projects: booked in, built, handed over.
              </p>
              <h3>What the AI is and is not</h3>
              <ul>
                <li>
                  The receptionist and chatbot are AI systems. They work from the information and
                  the script you approve. They can misunderstand, and they can be wrong. We build
                  them to hand over to a person early rather than guess, and to never give clinical
                  advice, but you should check what they do, especially in the first weeks.
                </li>
                <li>
                  They are not an emergency service and must not be presented to callers as one.
                  Your voicemail, out-of-hours and emergency arrangements remain your responsibility.
                </li>
                <li>
                  Calls depend on your phone provider, call forwarding, the internet and the
                  platforms we build on. We do not promise that every call is answered, only that
                  the system is designed and monitored to answer the calls that reach it.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "your-part",
          heading: "What we need from you",
          body: (
            <ul>
              <li>
                Accurate information about your business, services, prices and opening hours, and
                prompt updates when they change. The AI can only say what it has been told.
              </li>
              <li>
                Sign-off on the script and the opening message before the service goes live. The
                opening message tells callers that the call is recorded and that they are speaking
                with an AI assistant. You may reword it; you may not remove it.
              </li>
              <li>
                Lawful use. You must have the right to forward your number to us, to have calls
                recorded, and to send the messages you ask us to send. You must not use the
                service to send unsolicited marketing or to collect information you have no right
                to collect.
              </li>
              <li>
                Keeping logins secure. Each person on your team gets their own login. Tell us
                straight away if you think a login has been compromised, and remove people who
                leave.
              </li>
              <li>
                Telling your patients or customers, in your own privacy notice, that calls and
                messages are handled by an AI service provided by us. We give you wording for this.
              </li>
            </ul>
          ),
        },
        {
          id: "fees",
          heading: "Fees and payment",
          body: (
            <>
              <ul>
                <li>
                  Fees are set out in your order form and are exclusive of VAT, which is added
                  where it applies. Monthly services are billed monthly in advance; projects are
                  billed as the order form says.
                </li>
                <li>Invoices are due within fourteen days unless the order form says otherwise.</li>
                <li>
                  Charges made by third-party platforms you choose to use, for example per-message
                  fees on WhatsApp or telephony charges above the allowance in your order, are
                  passed on at cost and shown separately.
                </li>
                <li>
                  If an invoice is more than fourteen days overdue we may suspend the service after
                  giving you seven days’ written warning. We restore it when the account is settled.
                </li>
                <li>
                  We may change our fees once a year with at least thirty days’ written notice. If
                  you do not accept a change you may end the agreement before it takes effect.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "term",
          heading: "Length of the agreement and how it ends",
          body: (
            <>
              <ul>
                <li>
                  Monthly services start on the go-live date in your order and run month to month
                  until ended. Either of us may end them by giving thirty days’ written notice by
                  email.
                </li>
                <li>
                  Either of us may end the agreement immediately if the other breaks it in a serious
                  way and does not put it right within fourteen days of being asked, or becomes
                  insolvent.
                </li>
                <li>
                  When the agreement ends we switch the service off, you turn call forwarding off,
                  and for thirty days you can take a copy of your calls, transcripts, bookings,
                  reviews and reports from the portal or by asking us. Ninety days after the end we
                  delete your data from our systems, except what we must keep for tax and company
                  law, and except where you have asked us in writing to delete it sooner.
                </li>
                <li>
                  Fees already paid for a period are not refunded if you end the agreement early,
                  unless we ended it or the law requires a refund.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "support",
          heading: "Support and service levels",
          body: (
            <>
              <p>
                Every client has a named contact at Truephase AI and can reach us by email during UK
                business hours. We aim to acknowledge a problem within one business day and to fix
                anything that stops calls being answered as a priority. We monitor the service
                automatically and are often working on a fault before you notice it.
              </p>
              <p>
                We do not promise uninterrupted service. Planned maintenance happens outside your
                opening hours wherever possible. Where a fault is caused by a platform we build on,
                we are limited by that platform’s own repair time.
              </p>
            </>
          ),
        },
        {
          id: "data",
          heading: "Data protection",
          body: (
            <>
              <p>
                For your callers’ and customers’ personal information, you are the controller and
                we are your processor. This section is the written contract that UK GDPR requires
                between us.
              </p>
              <ul>
                <li>
                  We process personal information only to provide the services in your order and on
                  your documented instructions, which include these terms and the settings you
                  choose in the portal.
                </li>
                <li>
                  We keep it confidential, make sure our staff are bound by confidentiality, and
                  apply the security measures described in our{" "}
                  <Link href="/privacy">privacy notice</Link>.
                </li>
                <li>
                  We use the service providers listed in our privacy notice as sub-processors. We
                  will tell you before adding or replacing one, and you may object within fourteen
                  days; if we cannot resolve the objection you may end the affected service.
                </li>
                <li>
                  Where a provider is outside the UK we put in place a lawful transfer mechanism and
                  will show it to you on request.
                </li>
                <li>
                  We help you respond to requests from individuals about their information, and to
                  meet your own security, breach-notification and impact-assessment duties, within
                  reason and at no extra charge for ordinary requests.
                </li>
                <li>
                  We tell you without undue delay if we become aware of a personal data breach
                  affecting your information, and give you what you need to assess it.
                </li>
                <li>
                  At the end of the agreement we return or delete personal information as described
                  in section 5, unless the law requires us to keep it.
                </li>
                <li>
                  We make available the information you reasonably need to show that we meet these
                  obligations, and allow an audit by you or an auditor you appoint, with reasonable
                  notice and no more than once a year unless a regulator requires otherwise.
                </li>
              </ul>
              <p>
                You confirm that you have a lawful basis for the processing you instruct, that your
                own privacy notice covers it, and that you will tell callers and customers that calls
                are recorded and handled by an AI service.
              </p>
            </>
          ),
        },
        {
          id: "ip",
          heading: "Who owns what",
          body: (
            <ul>
              <li>
                You own your data: your call records, transcripts, bookings, reviews, reports and
                the content you give us. You give us the permission we need to process it to run
                the service.
              </li>
              <li>
                We own the platform, the configurations, the prompts and the tools we use to build
                and run the service, and we may reuse what we learn in general for other clients,
                never your data or anything confidential to you.
              </li>
              <li>
                For web design and video projects, once the final invoice is paid you own the
                finished website content and videos we deliver. Stock, font and software licences
                stay with their owners and we tell you what they are. We keep the right to show the
                work in our portfolio unless you ask us not to.
              </li>
            </ul>
          ),
        },
        {
          id: "platforms",
          heading: "Other people’s platforms",
          body: (
            <p>
              Parts of the service run on platforms we do not control: telephone networks, Meta
              (WhatsApp, Instagram, Messenger), Google, Wix and others. Their rules apply, they
              change them without asking us, and they occasionally fail. Where a platform rule
              limits what the service can do, we tell you on this site and in onboarding rather
              than promise around it.
            </p>
          ),
        },
        {
          id: "liability",
          heading: "Liability",
          body: (
            <>
              <ul>
                <li>
                  Nothing in this agreement limits liability for death or personal injury caused by
                  negligence, for fraud, or for anything else the law does not allow to be limited.
                </li>
                <li>
                  Subject to that, our total liability to you under or in connection with this
                  agreement in any twelve-month period is limited to the fees you paid us in the
                  twelve months before the event giving rise to the claim.
                </li>
                <li>
                  Neither of us is liable to the other for loss of profit, loss of business, or
                  indirect or consequential loss.
                </li>
                <li>
                  We are not liable for a missed call, booking or message caused by your phone
                  provider, your call-forwarding settings, your internet connection, information
                  you gave us that was wrong or out of date, or a third-party platform outage.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "confidentiality",
          heading: "Confidentiality",
          body: (
            <p>
              Each of us keeps the other’s confidential information confidential and uses it only
              for this agreement, during the agreement and for three years after it ends. This
              does not cover information that is already public, that was known before it was
              shared, or that the law requires to be disclosed.
            </p>
          ),
        },
        {
          id: "general",
          heading: "General",
          body: (
            <ul>
              <li>
                We may update these terms. We give at least thirty days’ notice of a change by
                email and by updating the version and date at the top of this page. If you do not
                accept a change you may end the agreement before it takes effect.
              </li>
              <li>Notices between us are sent by email to the addresses on the order form and to {CONTACT_EMAIL}.</li>
              <li>
                Neither of us may transfer this agreement to someone else without the other’s
                written consent, except to a company that takes over our business.
              </li>
              <li>
                If part of this agreement turns out to be unenforceable, the rest still applies.
              </li>
              <li>
                This agreement is governed by the law of England and Wales, and the courts of
                England and Wales have exclusive jurisdiction.
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
