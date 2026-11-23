import { getSlots, refreshSlots } from "../../../_components/booking-slots";

export const dynamic = "force-dynamic";
/* Run next to the visitors (UK) and the booking engine (n8n, EU) rather than
   the default US region. */
export const preferredRegion = "lhr1";

/* Free call times for the next two weeks. Served from the website's stored
   list (see _components/booking-slots.ts), so this answers at once.
   "?fresh=..." is sent after a time turned out to be taken: it refreshes the
   stored list first, so the visitor sees the calendar as it is now. */
export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.has("fresh");
  try {
    if (fresh) await refreshSlots();
    const data = await getSlots();
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { ok: false, error: "We could not load the free times. Please try again in a moment." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
