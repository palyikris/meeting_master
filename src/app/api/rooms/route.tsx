import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const userProfile = await getUserProfileFromRequest();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" &&
      userProfile.role !== "admin" &&
      userProfile.role !== "user")
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

  const { data: rooms, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("company_id", userProfile.company_id);

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(rooms), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
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

  const body = await request.json();
  const { name } = body;

  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required." }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert([{ name, company_id: userProfile.company_id }])
    .select("*");

  if (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data[0]), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}