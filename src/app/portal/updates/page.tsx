import { redirect } from "next/navigation";

export default async function UpdatesPage() {
  // Redirect to external weekly update site
  redirect("https://what-did-you-get-done-this-week.vercel.app/");
}
