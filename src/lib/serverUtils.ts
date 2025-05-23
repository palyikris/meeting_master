import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { Company } from "@/types";


export async function getCompanies(): Promise<Company[] | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("companies").select("*");

  return error ? null : data;
}

export async function createCompany(name: string): Promise<Company | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("companies")
    .insert([{ name }])
    .select("*");

  if (error) {
    console.error("Error creating company:", error);
  }

  return error ? null : data[0];
}