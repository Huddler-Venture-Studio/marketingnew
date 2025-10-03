import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, ensure user exists in public.users table
    const { error: userInsertError } = await supabaseAdmin
      .from("users")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || "",
        role: user.user_metadata?.role || "investor",
      }, {
        onConflict: "id"
      });

    if (userInsertError) {
      console.error("User insert error:", userInsertError);
    }

    // Check if user already has a pending or approved request
    const { data: existing } = await supabaseAdmin
      .from("l2_access")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["pending", "approved"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending or approved L2 access request" },
        { status: 400 }
      );
    }

    // Create L2 access request using admin client
    const { data, error } = await supabaseAdmin
      .from("l2_access")
      .insert({
        user_id: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("L2 access request error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (requestError) {
    console.error("L2 access request exception:", requestError);
    return NextResponse.json(
      { error: "Failed to request L2 access", details: requestError instanceof Error ? requestError.message : String(requestError) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's L2 access status
    const { data, error } = await supabase
      .from("l2_access")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data || null }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get L2 access status" },
      { status: 500 }
    );
  }
}
