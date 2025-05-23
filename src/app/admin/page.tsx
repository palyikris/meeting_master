"use client"

import CompanyTableComponent from "@/features/admin/table";
import { useCompanies } from "@/hooks/company/useCompanies";
import { Box } from "@mui/material";

export default function AdminPage() {
  const { data, isLoading, error } = useCompanies();

  if (error) {
    return <div>Error loading companies: {error.message}</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh"
      }}
    >
      <CompanyTableComponent
        data={data || []}
        isLoading={isLoading}
      ></CompanyTableComponent>
    </Box>
  );
}