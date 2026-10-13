import { BOOKING_ENGINE } from "../../../_components/booking-api";

export const dynamic = "force-dynamic";
/* Run next to the visitors (UK) and the booking engine (n8n, EU) rather than
   the default US region: every free-times request crosses that gap. */
export const preferredRegion = "lhr1";

/* Free call times for the next two weeks, read live from Google Calendar.

   Speed: asking n8n, which asks Google, takes 0.7s warm and ~3s when n8n has
   been idle, and every visitor used to wait for it. A good answer is now kept
   at Vercel's edge for 60 seconds and served stale for up to 30 minutes while a
   fresh copy is fetched in the background, so the calendar appears at once.
   That is safe: the booking step in n8n re-checks the calendar before it
   books, and replies "just been taken" if the time has gone. After that reply
   the page asks again with ?fresh=..., which skips the cached copy. */
export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.has("fresh");
  try {
    const res = await fetch(`${BOOKING_ENGINE}/slots`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    const cacheable = res.ok && data?.ok === true && !fresh;
    return Response.json(data, {
      status: res.ok ? 200 : 502,
      headers: {
        "Cache-Control": cacheable
          ? "public, max-age=0, s-maxage=60, stale-while-revalidate=1800"
          : "no-store",
      },
    });
  } catch {
    return Response.json(
      { ok: false, error: "We could not load the free times. Please try again in a moment." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
