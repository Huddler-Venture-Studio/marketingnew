"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/common/button";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/portal");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-surface-secondary p-8 dark:border-dark-border dark:bg-dark-surface-secondary">
          <h1 className="mb-2 text-center text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Sign In
          </h1>
          <p className="mb-8 text-center text-text-secondary dark:text-dark-text-secondary">
            Access the Huddler Portal
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface-primary px-4 py-2 text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface-primary px-4 py-2 text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-[100px]"
                intent="primary"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-text-tertiary hover:text-text-primary dark:text-dark-text-tertiary dark:hover:text-dark-text-primary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
