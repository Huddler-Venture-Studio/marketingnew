"use client";

import { useState, useEffect } from "react";
import { Button } from "@/common/button";
import Link from "next/link";

export function L2AccessRequest() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchL2Status();
  }, []);

  const fetchL2Status = async () => {
    try {
      const response = await fetch("/api/l2-access/request");
      const result = await response.json();

      if (response.ok) {
        setStatus(result.data?.status || null);
      }
    } catch (fetchError) {
      console.error("Failed to fetch L2 status:", fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestL2Access = async () => {
    setRequesting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/l2-access/request", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("pending");
        setMessage({
          type: "success",
          text: "L2 access request submitted successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to request L2 access",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while requesting L2 access",
      });
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return null;
  }

  // If user has approved L2 access, show link to L2 portal
  if (status === "approved") {
    return (
      <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-green-500 bg-green-50 p-6 dark:border-green-400 dark:bg-green-950/30">
        <div className="flex items-start gap-4">
          <svg
            className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400"
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
          <div className="flex-1">
            <h3 className="mb-2 font-semibold text-green-800 dark:text-green-200">
              L2 Access Approved
            </h3>
            <p className="mb-4 text-sm text-green-700 dark:text-green-300">
              You have been granted access to Level 2 resources.
            </p>
            <Link
              href="/portal/l2"
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              Access L2 Portal
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user has pending request
  if (status === "pending") {
    return (
      <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-yellow-500 bg-yellow-50 p-6 dark:border-yellow-400 dark:bg-yellow-950/30">
        <div className="flex items-start gap-4">
          <svg
            className="h-6 w-6 shrink-0 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="mb-1 font-semibold text-yellow-800 dark:text-yellow-200">
              L2 Access Request Pending
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your request for Level 2 access is being reviewed by an administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user can request L2 access
  return (
    <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-border bg-surface-secondary p-6 dark:border-dark-border dark:bg-dark-surface-secondary">
      <div className="flex items-start gap-4">
        <svg
          className="h-6 w-6 shrink-0 text-text-tertiary dark:text-dark-text-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="mb-2 font-semibold text-text-primary dark:text-dark-text-primary">
            Request Level 2 Access
          </h3>
          <p className="mb-4 text-sm text-text-secondary dark:text-dark-text-secondary">
            Level 2 provides access to additional premium resources and features. Click below to
            request access from an administrator.
          </p>

          {message && (
            <div
              className={`mb-4 rounded-md border p-3 text-sm ${
                message.type === "success"
                  ? "border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-950/30 dark:text-green-400"
                  : "border-red-500 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button onClick={handleRequestL2Access} disabled={requesting} intent="primary">
            {requesting ? "Requesting..." : "Request L2 Access"}
          </Button>
        </div>
      </div>
    </div>
  );
}
