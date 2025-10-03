import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all L2 access requests
    const { data: l2Requests, error } = await supabaseAdmin
      .from("l2_access")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch user details for each request
    const requestsWithUsers = await Promise.all(
      (l2Requests || []).map(async (request) => {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
          request.user_id
        );

        return {
          ...request,
          user: {
            id: userData.user?.id,
            email: userData.user?.email || "Unknown",
            raw_user_meta_data: userData.user?.user_metadata || {},
          },
        };
      })
    );

    return NextResponse.json({ data: requestsWithUsers }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch L2 access requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch L2 access requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, status, notes } = await request.json();

    if (!userId || !status) {
      return NextResponse.json(
        { error: "User ID and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the most recent pending request for this user
    const { data: latestRequest, error: fetchError } = await supabaseAdmin
      .from("l2_access")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !latestRequest) {
      return NextResponse.json({ error: "No pending request found for this user" }, { status: 400 });
    }

    // Update the specific request by ID
    const updateData: {
      status: string;
      notes: string | null;
      approved_at?: string;
    } = {
      status,
      notes: notes || null,
    };

    if (status === "approved") {
      updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("l2_access")
      .update(updateData)
      .eq("id", latestRequest.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If approved, upgrade user role to admin
    if (status === "approved") {
      // Update role in auth.users metadata
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          user_metadata: { role: "admin" }
        }
      );

      if (authError) {
        console.error("Failed to update user role in auth:", authError);
      }

      // Update role in public.users table
      const { error: usersError } = await supabaseAdmin
        .from("users")
        .update({ role: "admin" })
        .eq("id", userId);

      if (usersError) {
        console.error("Failed to update user role in users table:", usersError);
      }
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update L2 access" },
      { status: 500 }
    );
  }
}
