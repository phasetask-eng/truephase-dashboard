import type { Metadata } from "next";
import { LegalPage } from "../_components/legal-page";

export const metadata: Metadata = { title: "Terms — Truephase" };

export default function Terms() {
  return (
    <LegalPage
      title="Terms of service"
      covers={[
        "What Truephase agrees to provide, and what we do not",
        "What we need from you for the service to work",
        "Keeping your account and your team's logins secure",
        "Fees, billing periods and what happens if a payment fails",
        "Ending the agreement, on either side, and what notice applies",
        "What happens to your data when an account closes",
        "Limits of our liability, in plain terms",
      ]}
    />
  );
}
