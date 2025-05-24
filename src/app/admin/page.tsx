"use client"

import CompanyTableComponent from "@/features/admin/table";
import { useCompanies } from "@/hooks/company/useCompanies";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

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
        height: "100vh",
        position: "relative"
      }}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#1E293B"
          },

          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#10B981"
            }
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#EF4444"
            }
          },
          loading: {
            iconTheme: {
              primary: "#4E77E4",
              secondary: "#4E77E4"
            }
          }
        }}
      ></Toaster>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          clipPath: "polygon(37% 0, 37% 0, 18% 100%, 0 100%, 0 0)",
          background: "linear-gradient(0deg, #4E77E4 50%, #10B981 100%)"
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          clipPath: "polygon(37% 0, 37% 0, 18% 100%, 0 100%, 0 0)",
          background: "linear-gradient(0deg, #4E77E4 50%, #10B981 100%)",
          transform: "scale(-1, -1)"
        }}
      ></Box>
      <CompanyTableComponent
        data={data || []}
        isLoading={isLoading}
      ></CompanyTableComponent>
    </Box>
  );
}