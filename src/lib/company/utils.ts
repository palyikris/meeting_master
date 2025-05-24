import { Company } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";

export async function getCompanies(): Promise<Company[] | null> {
  const { data } = await axios.get("/api/companies");

  if (!data || data.error) {
    console.error("Error fetching companies:", data.error);
    toast.error("Error fetching companies!");
    return null;
  }

  return data;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const { data } = await axios.get(`/api/companies/${id}`);

  if (!data || data.error) {
    console.error("Error fetching company:", data.error);
    toast.error("Error fetching company!");
    return null;
  }

  return data;
}

export async function createCompany(
  company: Omit<Company, "id" | "created_at" | "is_active">
): Promise<Company | null> {
  const { data } = await axios.post("/api/companies", company);

  if (!data || data.error) {
    console.error("Error creating company:", data.error);
    return null;
  }

  toast.success("Company created successfully!");
  return data;
}

type CompanyUpdate = Omit<Company, "created_at">;

export async function updateCompany(
  company: CompanyUpdate
): Promise<Company | null> {
  const { data } = await axios.put(`/api/companies/${company.id}`, company);

  if (!data || data.error) {
    console.error("Error updating company:", data.error);
    toast.error("Error updating company!");
    return null;
  }

  toast.success("Company updated successfully!");
  return data;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const { data } = await axios.delete(`/api/companies/${id}`);

  if (!data || data.error) {
    console.error("Error deleting company:", data.error);
    toast.error("Error deleting company!");
    return false;
  }

  toast.success("Company deleted successfully!");

  return true;
}
