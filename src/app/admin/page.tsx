"use client"

import CompanyTableComponent from "@/features/admin/table";
import { useCompanies } from "@/hooks/useCompanies";

export default function AdminPage() {
  const { data, isLoading, error } = useCompanies();

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }

  return (
    <CompanyTableComponent
      data={data || []}
      isLoading={isLoading}
    ></CompanyTableComponent>
  );
}