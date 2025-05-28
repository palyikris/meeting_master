import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export const checkSession = async (supabase: SupabaseClient, router: AppRouterInstance) => {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else if (profile?.role === "company_admin" || profile?.role === "user") {
      router.push("/dashboard");
    }
  }
};
