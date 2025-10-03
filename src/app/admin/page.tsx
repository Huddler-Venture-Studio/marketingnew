"use client";

import { useState, useEffect } from "react";
import { Button } from "@/common/button";

type L2AccessRequest = {
  id: string;
  user_id: string;
  status: string;
  requested_at: string;
  approved_at?: string;
  notes?: string;
  user: {
    email: string;
    raw_user_meta_data: {
      role?: string;
    };
  };
};

export default function AdminInvitePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "investor">("investor");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [l2Requests, setL2Requests] = useState<L2AccessRequest[]>([]);
  const [l2Loading, setL2Loading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [hoveredReject, setHoveredReject] = useState<string | null>(null);

  useEffect(() => {
    fetchL2Requests();
  }, []);

  const fetchL2Requests = async () => {
    try {
      const response = await fetch("/api/l2-access/manage");
      const result = await response.json();

      if (response.ok) {
        setL2Requests(result.data || []);
      } else {
        console.error("Failed to fetch L2 requests:", result);
      }
    } catch (fetchError) {
      console.error("Failed to fetch L2 requests exception:", fetchError);
    } finally {
      setL2Loading(false);
    }
  };

  const handleUpdateL2Status = async (userId: string, status: "approved" | "rejected") => {
    setProcessing(userId);

    try {
      const response = await fetch("/api/l2-access/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
        }),
      });

      if (response.ok) {
        await fetchL2Requests();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to update status");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Call the API route to send the invite
      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Failed to send invitation" });
      } else {
        setMessage({
          type: "success",
          text: `Invitation sent successfully to ${email}`,
        });
        setEmail("");
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to send invitation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Invite Users Section */}
        <div className="rounded-lg border border-border bg-surface-secondary p-8 dark:border-dark-border dark:bg-dark-surface-secondary">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-2 text-2xl font-semibold text-text-primary dark:text-dark-text-primary">
              Invite Users
            </h1>
            <p className="mb-6 text-sm text-text-secondary dark:text-dark-text-secondary">
              Send an invitation email to grant portal access
            </p>

            <form onSubmit={handleSendInvite} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 w-full rounded-md border border-border bg-surface-primary px-3 py-2 text-sm text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-text-primary dark:text-dark-text-primary"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "investor")}
                    required
                    className="h-11 w-full appearance-none rounded-md border border-border bg-surface-primary bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat px-3 py-2 pr-10 text-sm text-text-primary focus:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-text-tertiary/20 dark:border-dark-border dark:bg-dark-surface-primary dark:text-dark-text-primary dark:focus:border-dark-text-tertiary dark:focus:ring-dark-text-tertiary/20 md:w-[160px]"
                  >
                    <option value="investor">Investor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-md border p-3 text-sm ${
                    message.type === "success"
                      ? "border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-950/30 dark:text-green-400"
                      : "border-red-500 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4 dark:border-dark-border">
                <p className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
                  Investors can view portal content. Admins have full access.
                </p>
                <Button type="submit" disabled={loading} className="h-11 px-6" intent="primary">
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* L2 Access Management Section */}
        <div className="rounded-lg border border-border bg-surface-secondary p-8 dark:border-dark-border dark:bg-dark-surface-secondary">
          <h2 className="mb-2 text-2xl font-bold text-text-primary dark:text-dark-text-primary">
            Manage L2 Access Requests
          </h2>
          <p className="mb-8 text-text-secondary dark:text-dark-text-secondary">
            Review and approve/reject user requests for Level 2 access
          </p>

          {l2Loading ? (
            <p className="text-center text-text-secondary dark:text-dark-text-secondary">
              Loading L2 requests...
            </p>
          ) : l2Requests.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface-primary p-8 text-center dark:border-dark-border dark:bg-dark-surface-primary">
              <p className="text-text-secondary dark:text-dark-text-secondary">
                No L2 access requests found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {l2Requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-border bg-surface-primary p-6 dark:border-dark-border dark:bg-dark-surface-primary"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                          {request.user.email}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                      {request.approved_at && (
                        <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
                          Approved: {new Date(request.approved_at).toLocaleDateString()}
                        </p>
                      )}
                      {request.user.raw_user_meta_data?.role && (
                        <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
                          User Role: {request.user.raw_user_meta_data.role}
                        </p>
                      )}
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateL2Status(request.user_id, "approved")}
                          disabled={processing === request.user_id}
                          className="h-11 shrink-0 gap-1 rounded-full bg-accent-500 px-6 font-normal text-text-on-accent-primary outline-0 outline-hidden ring-control hover:bg-accent-600 focus-visible:ring-2 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
                        >
                          {processing === request.user_id ? "Processing..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleUpdateL2Status(request.user_id, "rejected")}
                          disabled={processing === request.user_id}
                          onMouseEnter={() => setHoveredReject(request.user_id)}
                          onMouseLeave={() => setHoveredReject(null)}
                          className="h-11 shrink-0 gap-1 rounded-full px-6 font-normal text-white outline-0 outline-hidden ring-control focus-visible:ring-2 disabled:opacity-50"
                          style={{
                            backgroundColor: hoveredReject === request.user_id ? '#b91c1c' : '#dc2626'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
