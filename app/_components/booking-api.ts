/* The booking engine runs in n8n (workflow "Truephase · Website booking").
   The browser never talks to n8n directly: these two routes on our own domain
   pass requests through, so the site's strict security policy stays as it is. */
export const BOOKING_ENGINE = "https://truephase.app.n8n.cloud/webhook/truephase-booking";
