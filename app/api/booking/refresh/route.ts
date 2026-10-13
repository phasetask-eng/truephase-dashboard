import { refreshSlots } from "../../../_components/booking-slots";

export const dynamic = "force-dynamic";
export const preferredRegion = "lhr1";

/* Called every morning by the Vercel cron job in vercel.json: fetches a new
   list of free times so the first visitor of the day does not wait for it. */
export async function GET() {
  try {
    const data = await refreshSlots();
    return Response.json(
      { ok: true, days: data.days?.length ?? 0, refreshedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ ok: false }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
