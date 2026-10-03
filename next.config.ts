import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/* Everything this site needs at runtime comes from its own origin: next/font
   bakes the three typefaces in at build time, the hero video and stills live
   in public/, and GSAP and lenis are bundled. So the policy can be strict.
   Next.js emits small inline scripts for hydration, which needs
   'unsafe-inline' unless every request mints a nonce through middleware -
   more machinery than a static marketing site should carry. The dev server
   additionally needs eval for React Fast Refresh; production does not. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  /* Two years. Add includeSubDomains and preload once every subdomain
     (app., portal.) is confirmed to serve HTTPS only. */
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // The hero video/still are versioned by file name (hero-tower-v2*), so they
      // can be cached for a year. Re-encode to a new name rather than overwrite.
      {
        source: "/:file(hero-tower-v[0-9]+.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
