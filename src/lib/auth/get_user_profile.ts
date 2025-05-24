import { createClient } from "../supabase/server";
import { UserProfile } from "@/types";

export async function getUserProfileFromRequest(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return error ? null : data;
}
