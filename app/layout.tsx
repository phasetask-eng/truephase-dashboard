import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Display — stands in for SuisseIntlCond 700. Single weight by design;
   the condensed face is only ever used at 28px and above. */
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/* Body — stands in for SuisseIntl. Variable axis so weight 450 is real. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Mono — stands in for SuisseIntlMono. Labels and technical meta only. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.truephase.co.uk"),
  title: "Truephase AI — AI that answers every call",
  description:
    "Truephase AI runs the phone, the follow-up and the reporting for UK clinics, care homes and salons. Every call answered, every review handled, every day written up.",
  openGraph: {
    title: "Truephase AI — AI that answers every call",
    description:
      "Truephase AI runs the phone, the follow-up and the reporting for UK clinics, care homes and salons.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${anton.variable} ${inter.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
