import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { getCompanies } from "@/lib/serverUtils";



export async function GET() {

  const userProfile = await getUserProfileFromRequest();


  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  

  const data = await getCompanies();

  if (!data) {
    return new Response(JSON.stringify({ error: "Internal server error. "}), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


