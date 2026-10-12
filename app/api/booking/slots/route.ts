import { BOOKING_ENGINE } from "../../../_components/booking-api";

export const dynamic = "force-dynamic";

/* Free call times for the next two weeks, read live from Google Calendar. */
export async function GET() {
  try {
    const res = await fetch(`${BOOKING_ENGINE}/slots`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return Response.json(data, {
      status: res.ok ? 200 : 502,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { ok: false, error: "We could not load the free times. Please try again in a moment." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
