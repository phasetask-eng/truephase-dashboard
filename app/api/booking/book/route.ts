import { after } from "next/server";
import { BOOKING_ENGINE } from "../../../_components/booking-api";
import { refreshSlots } from "../../../_components/booking-slots";

export const dynamic = "force-dynamic";

const FIELDS = ["name", "email", "business", "phone", "topic", "notes", "date", "time", "website"] as const;

/* Books the chosen time. n8n checks everything again, re-checks the time is
   still free, adds the call to Google Calendar and emails the invite. */
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Please fill in the form and try again." }, { status: 400 });
  }

  const clean: Record<string, string> = {};
  for (const key of FIELDS) {
    const value = body[key];
    clean[key] = typeof value === "string" ? value.slice(0, 1000) : "";
  }

  try {
    const res = await fetch(`${BOOKING_ENGINE}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });
    const data = await res.json();
    /* A time was booked: fetch a new list of free times once
       the visitor has their answer, so the next visitor sees it gone. */
    if (data?.ok) {
      after(async () => {
        try {
          await refreshSlots();
        } catch {
          /* the next refresh will catch up */
        }
      });
    }
    return Response.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { ok: false, error: "Sorry, something went wrong. Please try again, or email info@truephase.co.uk." },
      { status: 502 },
    );
  }
}
