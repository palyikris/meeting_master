import { Company } from "@/types";
import axios from "axios";

export async function getCompanies(): Promise<Company[] | null> {
  const { data } = await axios.get("/api/companies");

  if (!data || data.error) {
    console.error("Error fetching companies:", data.error);
    return null;
  }

  return data;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const { data } = await axios.get(`/api/companies/${id}`);

  if (!data || data.error) {
    console.error("Error fetching company:", data.error);
    return null;
  }

  return data;
}

export async function createCompany(company: Company): Promise<Company | null> {
  const { data } = await axios.post("/api/companies", company);

  if (!data || data.error) {
    console.error("Error creating company:", data.error);
    return null;
  }

  return data;
}

export async function updateCompany(
  id: string,
  company: Company
): Promise<Company | null> {
  const { data } = await axios.put(`/api/companies/${id}`, company);

  if (!data || data.error) {
    console.error("Error updating company:", data.error);
    return null;
  }

  return data;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const { data } = await axios.delete(`/api/companies/${id}`);

  if (!data || data.error) {
    console.error("Error deleting company:", data.error);
    return false;
  }

  return true;
}
