import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {

  const userProfile = await getUserProfileFromRequest();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" && userProfile.role !== "admin")
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!userProfile.company_id) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404,
    });
  }

  const id = (await params).eventId;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ error: "Event not found." }), {
      status: 404
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {

  const userProfile = await getUserProfileFromRequest();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" && userProfile.role !== "admin")
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!userProfile.company_id) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404,
    });
  }

  const id = (await params).eventId;
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("Error deleting event:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  return new Response(
    JSON.stringify({ message: "Event deleted successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const id = (await params).eventId;
  const supabase = await createClient();
  const body = await request.json();

  const { error } = await supabase
    .from("events")
    .update(body)
    .eq("id", id);

  if (error) {
    console.error("Error updating event:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  return new Response(
    JSON.stringify({ message: "Event updated successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}