import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { L2AccessRequest } from "./l2-access-request";

export const metadata: Metadata = {
  title: "Portal",
  description: "Access all Huddler resources in one place",
};

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userRole = user.user_metadata?.role || "investor";

  // Check if user has L2 access (approved)
  const { data: l2Access } = await supabase
    .from("l2_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();

  const hasL2Access = userRole === "admin" || !!l2Access;

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-text-primary dark:text-dark-text-primary md:text-5xl lg:text-6xl">
          Portal
        </h1>
        <p className="mb-4 text-center text-lg text-text-secondary dark:text-dark-text-secondary">
          Welcome, {user.user_metadata?.full_name || user.email}
        </p>
        <p className="mb-8 text-center text-text-secondary dark:text-dark-text-secondary">
          Access all your Huddler resources in one place
        </p>

        {userRole !== "admin" && <L2AccessRequest />}

        <div className="mb-16" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Documentation */}
          <Link
            href="https://docs.huddler.io/docs"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                Documentation
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Explore our comprehensive documentation to learn how to use Huddler effectively
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Visit Docs
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

          {/* Knowledge Base */}
          <Link
            href="https://base.huddler.io/"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Knowledge Base
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Find answers, guides, and best practices in our knowledge base
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Browse Knowledge
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

          {/* Data Room */}
          <Link
            href="https://dataroom.foundersuite.com/workspaces/1507696/files"
            className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                <svg
                  className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Foundersuite Data Room
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Access important documents and files in our secure data room
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              Open Data Room
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

          {/* Calendar */}
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
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                Calendar
              </h2>
            </div>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Schedule meetings and view upcoming events
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
              View Calendar
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

          {/* L2 Access Required Sections */}
          {hasL2Access && (
            <>
              {/* Portfolio */}
              <Link
                href="https://portfolio.huddler.io/"
                className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                    <svg
                      className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                    Portfolio
                  </h2>
                </div>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  View our company portfolio and projects
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
                  View Portfolio
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

              {/* Gallery */}
              <Link
                href="https://photo.huddler.io/"
                className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                    <svg
                      className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                    Gallery
                  </h2>
                </div>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Browse our photo gallery and company moments
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
                  View Gallery
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

              {/* Weekly Update */}
              <Link
                href="https://what-did-you-get-done-this-week.vercel.app/"
                className="group block rounded-lg border border-border bg-surface-secondary p-8 transition-all hover:border-text-tertiary hover:shadow-lg dark:border-dark-border dark:bg-dark-surface-secondary dark:hover:border-dark-text-tertiary"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-primary dark:bg-dark-surface-primary">
                    <svg
                      className="h-6 w-6 text-text-primary dark:text-dark-text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
                    Weekly Update
                  </h2>
                </div>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  View and submit weekly progress updates
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-text-tertiary group-hover:text-text-primary dark:text-dark-text-tertiary dark:group-hover:text-dark-text-primary">
                  View Updates
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
