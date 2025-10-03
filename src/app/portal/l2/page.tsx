import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "L2 Portal - Level 2 Access",
  description: "Access premium Level 2 resources",
};

export default async function L2PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user has approved L2 access
  const { data: l2Access, error } = await supabase
    .from("l2_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();

  // If there's no approved L2 access or an error, redirect to portal
  if (!l2Access || error) {
    redirect("/portal");
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary dark:text-dark-text-tertiary dark:hover:text-dark-text-primary"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Portal
          </Link>
        </div>

        <div className="mb-8 rounded-lg border border-green-500 bg-green-50 p-4 dark:border-green-400 dark:bg-green-950/30">
          <div className="flex items-center gap-3">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Level 2 Access Enabled
            </p>
          </div>
        </div>

        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary md:text-5xl lg:text-6xl">
          Level 2 Portal
        </h1>
        <p className="mb-16 text-center text-lg text-text-secondary dark:text-dark-text-secondary">
          Premium resources and exclusive content
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Premium Documentation */}
          <Link
            href="#"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Premium Documentation
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Access advanced technical documentation and implementation guides
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Explore
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Exclusive Resources */}
          <Link
            href="#"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Exclusive Resources
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Premium tools, templates, and resources for advanced users
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Access
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Priority Support */}
          <Link
            href="#"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Priority Support
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Get priority access to our support team for your questions
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Contact
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Advanced Analytics */}
          <Link
            href="#"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Advanced Analytics
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Detailed insights and analytics for your projects
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              View Analytics
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
