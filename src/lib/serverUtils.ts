import { createClient } from "./supabase/server";
import { Company } from "@/types";

export async function getCompanies(): Promise<Company[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("companies").select("*");

  return error ? null : data;
}

export async function createCompany({
  name,
  email,
  address,
  phone
}: {
  name: string;
  email: string;
  address: string;
  phone: string;
}): Promise<Company | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .insert([{ name, email, address, phone }])
    .select("*");

  if (error) {
    console.error("Error creating company:", error);
  }

  return error ? null : data[0];
}
