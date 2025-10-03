"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/common/button";

export default function SetupPasswordPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleTokenExchange = async () => {
      // Check for error parameters
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setError(errorDescription || "Invalid or expired invitation link");
        return;
      }

      // Exchange the token hash for a session
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "invite" && accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setError(sessionError.message);
          } else {
            setSessionReady(true);
          }
        } catch (err) {
          setError("Failed to verify invitation. Please try again.");
        }
      } else {
        // Check if user already has a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSessionReady(true);
        } else {
          setError("Invalid or expired invitation link. Please request a new invitation.");
        }
      }
    };

    handleTokenExchange();
  }, [searchParams, supabase.auth]);

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate name
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // Update the user's password and name in auth
      const { error: authError } = await supabase.auth.updateUser({
        password: password,
        data: {
          full_name: name.trim(),
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
      // Sign out the user after password setup
      await supabase.auth.signOut();

      // Redirect to main site after 2 seconds
      setTimeout(() => {
        window.location.href = "https://huddler.io";
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying session
  if (!sessionReady && !error) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center dark:border-dark-border dark:bg-dark-surface-secondary">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-text-tertiary border-t-transparent"></div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              Verifying Invitation
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center dark:border-dark-border dark:bg-dark-surface-secondary">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              Password Set Successfully!
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Redirecting to huddler.io...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-surface-secondary p-8 dark:border-dark-border dark:bg-dark-surface-secondary">
          <h1 className="mb-2 text-center text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Set Your Password
          </h1>
          <p className="mb-8 text-center text-text-secondary dark:text-dark-text-secondary">
            Create a password for your Huddler account
          </p>

          <form onSubmit={handleSetupPassword} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface-primary px-4 py-2 text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                placeholder="Enter your full name"
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
                minLength={8}
                className="w-full rounded-md border border-border bg-surface-primary px-4 py-2 text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                placeholder="Enter your password"
              />
              <p className="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-border bg-surface-primary px-4 py-2 text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              intent="primary"
            >
              {loading ? "Setting password..." : "Set Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
