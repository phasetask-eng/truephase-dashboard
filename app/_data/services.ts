/**
 * One source of truth for the six services.
 *
 * The home page renders `tag`/`title`/`body` as a card; /services/[slug]
 * renders the rest. Adding a service here adds both, and the two can never
 * drift apart.
 *
 * On `stats`: these are figures from published industry research, not our own
 * measurements, and each one carries the source it came from. Task Automation
 * has none on purpose — nothing we found was solid enough to print, and a made
 * up number on a page that sells trust is a bad trade.
 */

export type Service = {
  slug: string;
  tag: string;
  title: string;
  /** card body on the home page */
  body: string;
  /** one-line summary under the heading on the detail page */
  lede: string;
  /** the problem, in the client's words */
  problem: string;
  stats: { figure: string; note: string; source: string }[];
  included: { title: string; body: string }[];
  how: { step: string; body: string }[];
  fit: string[];
  /** Things the service genuinely cannot do. Present where platform rules or
      regulation constrain what may honestly be promised. */
  limits?: string[];
  /** true for the two that are projects rather than daily automations */
  project?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "ai-receptionist",
    tag: "Voice",
    title: "AI Receptionist",
    body: "Answers on the first ring, day or night. Understands what they want, takes the details, and books them into your diary while they are still on the phone.",
    lede: "A voice that answers every call and finishes the job \u2014 the booking is in your diary before they hang up.",
    problem:
      "The calls you miss are not spread evenly. They land while you are with a client, on the other line, or closed \u2014 exactly when someone has decided to book and wants it done now. And a call that ends in \u201cwe will ring you back to confirm\u201d is a call you can still lose. Voicemail holds nobody.",
    stats: [
      {
        figure: "42 hours",
        note: "was the average time businesses took to make first contact with an enquiry, across an audit of 2,241 firms.",
        source: "Harvard Business Review, Oldroyd, McElheran & Elkington",
      },
      {
        figure: "70%",
        note: "of people go with whoever replies first. Only 23% would try a business again after no response \u2014 though 77% of owners assume they would.",
        source: "Moneypenny survey of 5,001 UK consumers, 2026 \u2014 run by a company selling call answering",
      },
      {
        figure: "~34%",
        note: "average fall in missed appointments when reminders are sent, across peer-reviewed studies of outpatient clinics.",
        source: "Systematic reviews, clinical settings \u2014 not salons or trades",
      },
    ],
    included: [
      {
        title: "Answers on the first ring",
        body: "Day, night, weekends, bank holidays. There is no queue and no hold music, because there is no one waiting to become free.",
      },
      {
        title: "Understands what they want",
        body: "Not a phone tree. It listens, works out whether this is a booking, a question, a reschedule or a complaint, and handles it accordingly.",
      },
      {
        title: "Takes the details properly",
        body: "Name, number, what they are calling about, spelled and confirmed back \u2014 so the note you read afterwards is one you can act on.",
      },
      {
        title: "Books them on the call",
        body: "Availability checked and the slot held while they are still on the phone. No callback, no \u201clet me check and get back to you\u201d, and no gap in which they ring somebody else.",
      },
      {
        title: "Into the diary you already use",
        body: "It writes to your existing calendar or practice software. You do not move systems and your team does not learn a new one.",
      },
      {
        title: "Confirmations and reminders",
        body: "Sent automatically, at the intervals you choose, by text or email. Reminders are the best-evidenced part of this whole page \u2014 though in one review a staff member phoning still edged out the automated version, so this buys you consistency rather than a better result.",
      },
      {
        title: "Reschedules and cancellations",
        body: "Handled on the phone, and the freed slot goes back into availability straight away rather than sitting empty for a fortnight.",
      },
      {
        title: "Knows when to pass it over",
        body: "Anything clinical, sensitive or unusual goes to a human. You set where that line sits; it does not guess.",
      },
    ],
    how: [
      {
        step: "We listen to how you answer now",
        body: "Your greeting, your services, your prices, the questions you get every week, and the things you never want an AI to answer. We map your real availability at the same time \u2014 room, chair, practitioner, appointment length, the slots you keep back.",
      },
      {
        step: "We build the agent on your number",
        body: "It uses your words, not a script we wrote for someone else, and it connects to the diary you already keep. You hear it and change anything that does not sound like you.",
      },
      {
        step: "It goes live behind your existing phone",
        body: "It picks up when you cannot \u2014 after a set number of rings, out of hours, or every call. Your number does not change, and from that point a call can become a booking without anyone typing it in.",
      },
      {
        step: "You read the day back in the portal",
        body: "Every call with a transcript, an outcome and a recording, and every booking it made. Nothing disappears into a black box.",
      },
    ],
    fit: [
      "Practices where the phone rings while you are hands-on with a client",
      "Anyone closing at 5pm whose callers are deciding at 8pm",
      "Front desks that are one person, and that person takes lunch",
      "Diaries where an empty slot cannot be resold at short notice",
    ],
  },
  {
    slug: "ai-chatbot",
    tag: "Chat",
    title: "AI Chatbot",
    body: "Website, WhatsApp, Instagram and Facebook answered from one inbox, in seconds, at any hour \u2014 booked into your diary, and handed to a person the moment it should be.",
    lede: "Four inboxes, one brain. Every typed enquiry answered in seconds and written down, wherever it came from.",
    problem:
      "Enquiries stopped arriving by phone alone. They come through the website at 9pm, as an Instagram DM on Sunday, as a WhatsApp while you are on a job. Four apps, four notification badges, and the one you miss is the one that was ready to book. Most people do not chase you \u2014 they just go quiet, and you never learn it happened.",
    stats: [
      {
        figure: "23% vs 77%",
        note: "Only 23% of people would try a business again after no response. 77% of business owners think they would.",
        source: "Moneypenny, 5,001 UK consumers, 2026 \u2014 vendor-run",
      },
      {
        figure: "90%",
        note: "of UK online adults used WhatsApp last year \u2014 the highest daily reach of any app in the country.",
        source: "Ofcom Online Nation 2025, the UK regulator",
      },
      {
        figure: "1%",
        note: "of Britons name a chatbot as their preferred way to contact a business. That is exactly why a person is one tap away \u2014 people do not want to talk to AI, they want to not be ignored.",
        source: "YouGov",
      },
    ],
    included: [
      {
        title: "Four doorways, one inbox",
        body: "Your website chat, WhatsApp, Instagram DMs and Facebook Messenger all land in the same place. You stop checking four apps and nothing falls between them.",
      },
      {
        title: "Answered in seconds, at any hour",
        body: "Sunday evening, bank holiday, the middle of a job. When someone messages you they get a real answer straight away, not a read receipt.",
      },
      {
        title: "Books into the same diary",
        body: "The same booking engine the phone uses. A message at 11pm becomes an appointment at 11pm, not a note to ring them back.",
      },
      {
        title: "Asks what you would ask",
        body: "What is it, how urgent, have they been before, which practitioner. The answers arrive with the enquiry, so whoever picks it up is not starting cold.",
      },
      {
        title: "A person, one tap away",
        body: "It hands over the moment a conversation needs judgement, with the whole thread attached. This is a feature, not a fallback \u2014 most people want to know a human is reachable.",
      },
      {
        title: "Instagram comments become conversations",
        body: "Someone comments on a post asking what you charge; it answers once, privately, and moves them into DMs where a booking can happen. One automated reply per comment is all Meta permits, so it opens the door rather than chasing anyone through it.",
      },
      {
        title: "One thread per customer",
        body: "They message on Instagram in March and WhatsApp in June, and it is the same conversation with the same history \u2014 not two strangers.",
      },
      {
        title: "Says it is AI, and stays out of clinical detail",
        body: "It tells people what it is, refuses to take symptoms or medical detail, and routes anything sensitive to your team. For clinics and care homes that is a requirement, not a nicety.",
      },
    ],
    how: [
      {
        step: "We connect the channels you actually use",
        body: "Website widget, WhatsApp Business, Facebook Page and Instagram. You do not need all four \u2014 most practices start with the website and WhatsApp, because that is where the volume is.",
      },
      {
        step: "We teach it your business, and only your business",
        body: "Your services, prices, opening hours, the questions you get weekly, and the subjects it must never touch. It answers about you, not about anything and everything \u2014 that is both better for you and required by WhatsApp\u2019s own rules.",
      },
      {
        step: "It goes live with a human always reachable",
        body: "You set what it handles alone, what it hands over, and who it hands over to. Nothing client-facing goes live before you have read it.",
      },
      {
        step: "Every conversation lands in the portal",
        body: "Searchable, attributable, exportable. You can see what was asked, what was answered, and what it turned into.",
      },
    ],
    limits: [
      "It replies to people who message you. Neither WhatsApp nor Instagram lets a business start a conversation with someone who has not contacted it first, and no software changes that.",
      "On WhatsApp there is a 24-hour window after someone messages in which it can answer freely. After that, only a pre-approved template may be sent \u2014 or a person can reply. On Instagram and Messenger, follow-up outside that window has to come from a human.",
      "Google Business Profile chat is not a channel. Google retired it in July 2024, so nobody can offer it.",
      "It is not a triage tool. It will not assess symptoms, advise on medication, or decide urgency \u2014 for a clinic that is both a safety line and a regulatory one.",
      "Reminders cannot run on Instagram at all \u2014 Meta provides no compliant route. They go by WhatsApp template, text or email instead.",
      "It cannot take a card number in the chat. Card rules forbid it, so it sends a secure payment link instead.",
      "Meta charges per message on WhatsApp from October 2026. Volume is part of the pricing conversation rather than something we pretend is free.",
    ],
    fit: [
      "Practices getting Instagram enquiries they see two days later",
      "Anyone juggling four apps and a phone",
      "Businesses whose enquiries arrive at 9pm and on Sundays",
      "Teams who want messages answered without answering them",
    ],
  },
  {
    slug: "review-management",
    tag: "Reputation",
    title: "Review Management",
    body: "Sends the request at the right moment, tracks who opened it, drafts a reply to every review that lands.",
    lede: "Asking every happy client, at the moment they are happiest, instead of whenever someone remembers.",
    problem:
      "Most practices have a handful of reviews and a lot of satisfied clients. The gap is not the service — it is that nobody asks, and when they do it is three days late and by memory.",
    stats: [
      {
        figure: "97%",
        note: "of consumers read reviews before choosing a local business.",
        source: "Local consumer review research, 2026",
      },
      {
        figure: "81%",
        note: "use Google specifically to read them and judge a business.",
        source: "Local consumer review research, 2026",
      },
      {
        figure: "31%",
        note: "will only use a business rated 4.5 stars or higher — nearly double last year.",
        source: "Local consumer review research, 2026",
      },
    ],
    included: [
      {
        title: "Asked at the right moment",
        body: "The request goes out on the back of the appointment, while it is fresh, rather than whenever the admin pile gets cleared.",
      },
      {
        title: "You can see who opened it",
        body: "Sent, opened, clicked, left. You find out whether the ask is working, not just whether stars appeared.",
      },
      {
        title: "Every review gets a reply drafted",
        body: "In your voice, ready to approve. The good ones and the difficult ones — the difficult ones matter more and are the ones that get left.",
      },
      {
        title: "Nobody gets asked twice",
        body: "It knows who has already been asked and who has already left one. Chasing a client who reviewed you last month costs you goodwill.",
      },
    ],
    how: [
      {
        step: "We connect your Google profile",
        body: "That is where the reading happens, so that is where the asking points.",
      },
      {
        step: "We pick the trigger",
        body: "Usually the completed appointment. Sometimes a payment, sometimes a course of treatment finishing. Your call.",
      },
      {
        step: "The request goes out on its own",
        body: "One message, worded like you, with a link that takes two taps rather than a search.",
      },
      {
        step: "Replies land in the portal for approval",
        body: "Drafted for every review. You read it, change it if you want, publish.",
      },
    ],
    fit: [
      "Practices with good service and thin review counts",
      "Anyone below the 4.5 star line where filtering starts",
      "Teams who mean to reply to reviews and never get to it",
    ],
  },
  {
    slug: "task-automation",
    tag: "Back office",
    title: "Task Automation",
    body: "The repetitive work behind the front desk — chasing, filing, following up, writing the day up — handled without you.",
    lede: "The admin that fills the gaps between clients, done in the background instead of at the end of the day.",
    problem:
      "None of it is hard. It is chasing, filing, copying one thing into another, writing the same message for the ninth time. It just takes the evening, every evening, and it is the first thing to slip when you are busy.",
    stats: [],
    included: [
      {
        title: "The chasing",
        body: "Unpaid balances, unconfirmed appointments, forms that were sent and never came back. Followed up on a schedule, not on a whim.",
      },
      {
        title: "The filing",
        body: "Details out of the call and into the place they belong, without anyone opening two tabs and typing it twice.",
      },
      {
        title: "The follow-ups",
        body: "Post-treatment check-ins, rebooking nudges at the right interval, the message you would send if you had the time.",
      },
      {
        title: "The day written up",
        body: "What came in, what got booked, what needs you tomorrow — waiting for you in the morning rather than assembled by you at night.",
      },
    ],
    how: [
      {
        step: "We watch a normal week",
        body: "Not the week you wish you had. The actual repeated work, and roughly how long each piece takes.",
      },
      {
        step: "We pick the ones worth automating",
        body: "Frequency times minutes. Some jobs are not worth it and we will say so rather than build them to pad the list.",
      },
      {
        step: "We build and you approve",
        body: "Each automation runs past you before it touches a client. Anything client-facing you sign off first.",
      },
      {
        step: "It runs, and you can see it running",
        body: "Every action logged in the portal. If something stops, you find out from us, not from a client.",
      },
    ],
    fit: [
      "Owners doing admin after closing",
      "Front desks where the same task is done twenty times a week",
      "Anyone whose follow-up is good in theory and patchy in practice",
    ],
  },
  {
    slug: "web-design-brand-identity",
    tag: "Brand",
    title: "Web design & brand identity",
    body: "We design and build the site people land on after they hang up, and the brand it carries — worth having when the calls are being answered but the website is quietly undoing the work.",
    project: true,
    lede: "The site people check before they ring, and the one they land on afterwards to make sure they were right.",
    problem:
      "The phone can be answered perfectly and still lose the booking. People look you up first. If the site looks like it was built in 2014, the judgement is made before anyone speaks to you.",
    stats: [
      {
        figure: "Under 50ms",
        note: "is all it takes for a visitor to form a credibility judgement about a site.",
        source: "Web credibility research, cited 2026",
      },
      {
        figure: "75%",
        note: "of patients judge a clinic's credibility on its website design.",
        source: "Healthcare web design research, 2026",
      },
      {
        figure: "3 seconds",
        note: "is roughly how long a high-value enquiry gives a cluttered or slow site before leaving.",
        source: "Private clinic web design research, 2026",
      },
    ],
    included: [
      {
        title: "Website design and build",
        body: "Designed around the one thing the visitor came to do — book, ring, or find out whether you treat what they have. Fast, readable on a phone, and built to meet accessibility standards rather than to win an award.",
      },
      {
        title: "Brand identity and logo",
        body: "A mark, a palette, type and the rules for using them, so your signage, your socials and your site stop looking like three different businesses.",
      },
      {
        title: "Copy that sounds like you",
        body: "Written from how you actually talk about the work, not from the same paragraph every clinic site in the country is using.",
      },
      {
        title: "Real photography, not stock",
        body: "Your team and your premises, because the recognisable ones consistently outperform the smiling strangers.",
      },
    ],
    how: [
      {
        step: "We work out what the site is for",
        body: "Usually one job. Bookings, enquiries, or convincing someone you are worth the price. A site doing four jobs does none of them.",
      },
      {
        step: "Identity first, then pages",
        body: "The mark and the palette settle before any layout, because everything after inherits them.",
      },
      {
        step: "Built, reviewed, changed",
        body: "You see it working on a real device before it goes anywhere near your domain.",
      },
      {
        step: "Handed over properly",
        body: "It is yours. You get the files, the accounts and the ability to leave, which is the part most agencies are vague about.",
      },
    ],
    fit: [
      "Practices whose phone work is landing but whose site is undoing it",
      "Anyone who has outgrown the site they started with",
      "Businesses whose signage, socials and site do not match",
    ],
  },
  {
    slug: "ai-video-for-social",
    tag: "Social",
    title: "AI video for social",
    body: "Short-form video for your socials, made from your own footage and brand. Reels that keep you visible between appointments, without booking a videographer every month.",
    project: true,
    lede: "A steady run of short video from footage you already have, so the feed keeps working when you are busy.",
    problem:
      "Short video is where the attention is, and it is the first thing to stop when the diary fills. One good month, then nothing until someone remembers. The algorithm notices the gap long before your clients do.",
    stats: [
      {
        figure: "49%",
        note: "of marketers rank short-form video first for return on investment, ahead of every other format.",
        source: "Short-form video research, 2026",
      },
      {
        figure: "50%",
        note: "of all time spent on Instagram now goes to Reels.",
        source: "Instagram Reels research, 2026",
      },
      {
        figure: "55%",
        note: "of Reels views come from people who do not follow you — the strongest discovery format on the platform.",
        source: "Instagram Reels research, 2026",
      },
    ],
    included: [
      {
        title: "Reels and short-form video",
        body: "Cut for the platform and the sound-off scroll: captioned, paced for the first second, sized for the feed it is going to.",
      },
      {
        title: "Made from your own clips",
        body: "Your room, your team, your work. Phone footage is fine — it is the editing, captioning and pacing that does the lifting.",
      },
      {
        title: "A steady run, not a one-off",
        body: "An agreed number every month. Consistency is what the format rewards, and it is the part practices cannot sustain alone.",
      },
      {
        title: "On brand every time",
        body: "The same type, colours and lower-thirds each month, so the videos accumulate into something recognisable instead of looking borrowed.",
      },
    ],
    how: [
      {
        step: "We agree what you are showing",
        body: "Treatments, results, the team, the answers to questions you get constantly. Enough angles that it does not repeat.",
      },
      {
        step: "You send raw clips",
        body: "Filmed on a phone, when it suits. No shoot day, no crew standing in your treatment room.",
      },
      {
        step: "We cut, caption and brand them",
        body: "Edited to your identity, captioned for silent viewing, delivered ready to post.",
      },
      {
        step: "You approve and post",
        body: "Anything client-facing gets your sign-off first. Nothing goes out that you have not seen.",
      },
    ],
    fit: [
      "Practices who start posting well and stop after a month",
      "Anyone whose competitors are visible on video and they are not",
      "Teams with footage on their phones and no time to edit it",
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
