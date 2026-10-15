import { refreshSlots } from "../../../_components/booking-slots";

export const dynamic = "force-dynamic";
export const preferredRegion = "lhr1";

/* Refreshes the stored list of free call times at 6am UK time every day, so
   the first visitor of the day does not wait for it.

   Vercel's cron runs in UTC, and 6am in the UK is 05:00 UTC in summer and
   06:00 UTC in winter. So vercel.json calls this at both, and the cron call
   only does the work when it is 6am in London; the other one is skipped.
   A call from anywhere else (not the cron) always refreshes. */
export async function GET(request: Request) {
  const fromCron = (request.headers.get("user-agent") ?? "").includes("vercel-cron");
  if (fromCron) {
    const ukHour = Number(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23" }).format(
        new Date(),
      ),
    );
    if (ukHour !== 6) {
      return Response.json(
        { ok: true, skipped: "not 6am in the UK yet" },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
  }
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
