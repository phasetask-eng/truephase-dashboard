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
  /** true for the two that are projects rather than daily automations */
  project?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "ai-receptionist",
    tag: "Voice",
    title: "AI Receptionist",
    body: "Answers on the first ring, day or night. Takes the name and number, understands what they want, books them or passes them to you.",
    lede: "A voice that answers every call, so the ones you are missing stop going to whoever picks up next.",
    problem:
      "The calls you miss are not spread evenly. They land while you are with a client, on the other line, or closed — exactly when someone has decided to book and wants it done now. Voicemail does not hold them.",
    stats: [
      {
        figure: "Under 3%",
        note: "of callers who reach voicemail leave a message. The rest hang up.",
        source: "Missed-call industry research, 2026",
      },
      {
        figure: "82%",
        note: "say they would simply call a competitor when a business does not pick up.",
        source: "Missed-call industry research, 2026",
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
        body: "Name, number, what they are calling about, spelled and confirmed back — so the note you read afterwards is one you can act on.",
      },
      {
        title: "Knows when to pass it over",
        body: "Anything clinical, sensitive or unusual goes to a human. You set where that line sits; it does not guess.",
      },
    ],
    how: [
      {
        step: "We listen to how you answer now",
        body: "Your greeting, your services, your prices, the questions you get every week, and the things you never want an AI to answer.",
      },
      {
        step: "We build the agent on your number",
        body: "It uses your words, not a script we wrote for someone else. You hear it and change anything that does not sound like you.",
      },
      {
        step: "It goes live behind your existing phone",
        body: "It picks up when you cannot — after a set number of rings, out of hours, or every call. Your number does not change.",
      },
      {
        step: "You read the day back in the portal",
        body: "Every call with a transcript, an outcome and a recording. Nothing disappears into a black box.",
      },
    ],
    fit: [
      "Practices where the phone rings while you are hands-on with a client",
      "Anyone closing at 5pm whose callers are deciding at 8pm",
      "Front desks that are one person, and that person takes lunch",
    ],
  },
  {
    slug: "appointment-scheduler",
    tag: "Booking",
    title: "Appointment Scheduler",
    body: "Turns a phone call into a booking without anyone typing it in. Confirmations and reminders go out on their own.",
    lede: "The call becomes a booking in your diary while it is still happening, with nobody rekeying anything afterwards.",
    problem:
      "A call that ends in “we will ring you back to confirm” is a call you can still lose. The gap between the conversation and the diary entry is where bookings quietly evaporate.",
    stats: [
      {
        figure: "45%",
        note: "of the few who do leave a voicemail have already booked elsewhere before you ring back.",
        source: "Missed-call industry research, 2026",
      },
      {
        figure: "78%",
        note: "say they have abandoned a business after one unanswered call.",
        source: "Missed-call industry research, 2026",
      },
    ],
    included: [
      {
        title: "Booked during the call",
        body: "Availability checked and the slot held while they are still on the phone. No callback, no “let me check and get back to you”.",
      },
      {
        title: "Into the diary you already use",
        body: "It writes to your existing calendar or practice software. You do not move systems and your team does not learn a new one.",
      },
      {
        title: "Confirmations and reminders",
        body: "Sent automatically, at the intervals you choose, by text or email — the two messages that do most of the work against no-shows.",
      },
      {
        title: "Reschedules and cancellations",
        body: "Handled on the phone or by reply, and the freed slot goes back into availability straight away rather than sitting empty.",
      },
    ],
    how: [
      {
        step: "We map your real availability",
        body: "Room, chair, practitioner, appointment length, buffers, the slots you keep back. The rules you already work to, written down.",
      },
      {
        step: "We connect your calendar",
        body: "Your existing diary stays the source of truth. Nothing is migrated and nothing is duplicated.",
      },
      {
        step: "Booking goes live on the phone",
        body: "The receptionist can now finish the job rather than take a message about it.",
      },
      {
        step: "Reminders run on their own",
        body: "You set the timings once. After that it is a thing that happens, not a thing someone remembers to do.",
      },
    ],
    fit: [
      "Diaries where an empty slot cannot be resold at short notice",
      "Practices losing chair time to no-shows",
      "Anyone still writing bookings down to enter later",
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
