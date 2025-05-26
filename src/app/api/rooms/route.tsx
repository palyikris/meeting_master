import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createClient } from "@/lib/supabase/server";


export async function GET() {
  const supabase = await createClient();
  const userProfile = await getUserProfileFromRequest();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" && userProfile.role !== "admin")
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }

  if (!userProfile.company_id) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404
    });
  }

  const { data: rooms, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("company_id", userProfile.company_id);

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  return new Response(JSON.stringify(rooms), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}