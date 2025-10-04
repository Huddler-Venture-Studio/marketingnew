"use client";

import { useState, useEffect } from "react";

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

export default function L2AccessManagement() {
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

  return (
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
  );
}
