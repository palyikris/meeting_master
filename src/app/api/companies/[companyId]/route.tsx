import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const userProfile = await getUserProfileFromRequest();

  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const id = (await params).companyId;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching company:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const userProfile = await getUserProfileFromRequest();

  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const id = (await params).companyId;
  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", id);

  if (error) {
    console.error("Error deleting company:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: "Company deleted successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const userProfile = await getUserProfileFromRequest();

  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const id = (await params).companyId;

  const supabase = await createClient();
  const { name, is_active, email, address, phone } = await request.json();

  const { data, error } = await supabase
    .from("companies")
    .update({ name, is_active, email, address, phone })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating company:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
