import type { Metadata } from "next";
import AdminSubmitForm from "@/components/AdminSubmitForm";

export const metadata: Metadata = {
  title: "Spiel einlesen — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSubmitPage() {
  return <AdminSubmitForm />;
}
