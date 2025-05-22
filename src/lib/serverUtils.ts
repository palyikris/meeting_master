import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { Company } from "@/types";


export async function getCompanies(): Promise<Company[] | null> {

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("is_active", true);

  
  return error? null : data;
}