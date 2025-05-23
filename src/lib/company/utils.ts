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

export async function createCompany(
  companyName: string
): Promise<Company | null> {
  const { data } = await axios.post("/api/companies", {
    name: companyName
  });

  if (!data || data.error) {
    console.error("Error creating company:", data.error);
    return null;
  }

  return data;
}

type CompanyUpdate = Omit<Company, "created_at">;

export async function updateCompany(
  company: CompanyUpdate
): Promise<Company | null> {
  if (!company.id) {
    console.error("Company ID is required for update.");
    return null;
  }
  const { data } = await axios.put(`/api/companies/${company.id}`, company);

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
