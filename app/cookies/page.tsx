import type { Metadata } from "next";
import { LegalPage } from "../_components/legal-page";

export const metadata: Metadata = { title: "Cookies — Truephase AI" };

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie policy"
      covers={[
        "The cookies this website sets, and what each one is for",
        "Which are strictly necessary and which are not",
        "Any analytics or measurement we use",
        "How to accept, refuse or change your choice",
        "Cookies set inside the client portal, which are separate",
      ]}
    />
  );
}
