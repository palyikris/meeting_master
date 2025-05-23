import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createCompany, getCompanies } from "@/lib/serverUtils";
import { NextRequest } from "next/server";

export async function GET() {
  const userProfile = await getUserProfileFromRequest();

  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }

  const data = await getCompanies();

  if (!data) {
    return new Response(JSON.stringify({ error: "Internal server error. " }), {
      status: 500
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req: NextRequest) {
  const userProfile = await getUserProfileFromRequest();

  if (!userProfile || !userProfile.role || userProfile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }

  const { name } = await req.json();

  const data = await createCompany(name);

  if (!data) {
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

