import { redirect } from "next/navigation";

/**
 * Root page — redirects visitors to the English locale by default.
 * Arabic visitors can switch via the language toggle.
 */
export default function RootPage() {
  redirect("/en");
}
