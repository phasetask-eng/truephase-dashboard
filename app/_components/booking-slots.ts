import { unstable_cache, revalidateTag } from "next/cache";
import { BOOKING_ENGINE } from "./booking-api";

/* The list of free call times, kept by the website so visitors never wait for
   n8n (0.7s when awake, ~3s after it has been idle) and Google Calendar.

   When it is refreshed:
   - every morning by a Vercel cron job (vercel.json -> /api/booking/refresh)
   - straight after every successful booking
   - when a visitor picks a time that turns out to be taken
   - at the latest after 24 hours, as a safety net if the cron ever misses.

   Why a day-old list is safe: n8n re-checks Google Calendar before it books
   and answers "taken" if the time has gone. Times that have passed, or are
   now less than MIN_NOTICE_HOURS away, are removed on every request below. */

export const SLOTS_TAG = "booking-slots";
const MIN_NOTICE_HOURS = 4; // keep in step with the n8n workflow
const TZ = "Europe/London";

export type SlotsData = {
  ok: boolean;
  timezone?: string;
  callMinutes?: number;
  days?: { date: string; slots: string[] }[];
  error?: string;
};

/* Errors are thrown, never stored: a failed answer is not kept for the day. */
const readStored = unstable_cache(
  async (): Promise<SlotsData> => {
    const res = await fetch(`${BOOKING_ENGINE}/slots`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json()) as SlotsData;
    if (!res.ok || !data?.ok) throw new Error("booking engine did not return free times");
    return data;
  },
  [SLOTS_TAG],
  { tags: [SLOTS_TAG], revalidate: 60 * 60 * 24 },
);

/* Throw the stored list away and fetch a new one now. */
export async function refreshSlots(): Promise<SlotsData> {
  revalidateTag(SLOTS_TAG, { expire: 0 });
  return readStored();
}

/* UK wall-clock time ("2026-10-14", "08:00") -> a moment in time. */
function londonToMs(date: string, hm: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = hm.split(":").map(Number);
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  const name = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "shortOffset" })
    .formatToParts(new Date(asUtc))
    .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = name.match(/GMT([+-]\d+)(?::(\d+))?/);
  const offsetMin = match ? Number(match[1]) * 60 + Math.sign(Number(match[1])) * Number(match[2] ?? 0) : 0;
  return asUtc - offsetMin * 60_000;
}

/* The stored list, minus anything that is now in the past or too soon. */
export async function getSlots(): Promise<SlotsData> {
  const data = await readStored();
  const earliest = Date.now() + MIN_NOTICE_HOURS * 3_600_000;
  const days = (data.days ?? [])
    .map((d) => ({ date: d.date, slots: d.slots.filter((t) => londonToMs(d.date, t) >= earliest) }))
    .filter((d) => d.slots.length > 0);
  return { ...data, days };
}
