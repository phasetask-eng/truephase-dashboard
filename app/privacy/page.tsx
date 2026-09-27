import type { Metadata } from "next";
import { LegalPage } from "../_components/legal-page";

export const metadata: Metadata = { title: "Privacy — Truephase AI" };

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      covers={[
        "What information we collect, and why we need each piece of it",
        "Call recordings, transcripts and caller details — what is kept and for how long",
        "Who inside Truephase AI can see your account, and under what circumstances",
        "The other companies we rely on to deliver the service",
        "Where your data is stored and processed",
        "Your rights over your information, and how to exercise them",
        "How to reach us about anything on this page",
      ]}
    />
  );
}
