import { useMemo, useState } from "react";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_TablePagination
} from "material-react-table";

//Material UI Imports
import { Box, Button, Container } from "@mui/material";
import { useCreateCompany } from "@/hooks/company/useCreateCompany";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const CompanyTable = (props: { data: Company[]; isLoading: boolean }) => {
  const { data, isLoading } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { mutate: createCompany } = useCreateCompany();

  const { mutate: updateCompany } = useUpdateCompany();

  const { mutate: deleteCompany } = useDeleteCompany();

  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        id: "companies",
        header: "Companies",
        columns: [
          {
            accessorKey: "id",
            id: "id",
            header: "ID",
            size: 200,
            enableEditing: false,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  borderRadius: "0.25rem",
                  color: "#1E293B"
                })}
              >
                {renderedCellValue}
              </Box>
            )
          },
          {
            accessorKey: "name",
            id: "name",
            header: "Name",
            size: 200,
            enableEditing: true,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  borderRadius: "0.25rem",
                  fontWeight: "bold",
                  color: "#FF5C8D"
                })}
              >
                {renderedCellValue}
              </Box>
            )
          },
          {
            accessorKey: "email",
            header: "Email",
            size: 250,
            enableEditing: true,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  borderRadius: "0.25rem",
                  color: "#1E293B"
                })}
              >
                {renderedCellValue}
              </Box>
            )
          },
          {
            accessorKey: "address",
            header: "Address",
            size: 300,
            enableEditing: true,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  borderRadius: "0.25rem",
                  color: "#1E293B"
                })}
              >
                {renderedCellValue}
              </Box>
            )
          },
          {
            accessorKey: "phone",
            header: "Phone",
            size: 180,
            enableEditing: true,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  borderRadius: "0.25rem",
                  color: "#1E293B"
                })}
              >
                {renderedCellValue}
              </Box>
            )
          },
          {
            accessorKey: "is_active",
            header: "Active",
            size: 100,
            enableEditing: false,
            Cell: ({ renderedCellValue }) => (
              <Box
                component="span"
                sx={() => ({
                  color: renderedCellValue ? "#10B981" : "#EF4444",
                  borderRadius: "0.25rem"
                })}
              >
                {renderedCellValue ? "Active" : "Inactive"}
              </Box>
            )
          },
          {
            accessorKey: "created_at",
            header: "Created At",
            size: 150,
            enableEditing: false,
            Cell: ({ renderedCellValue }) => {
              const date = new Date(renderedCellValue as string);
              return (
                <Box
                  component="span"
                  sx={() => ({
                    borderRadius: "0.25rem",
                    color: "#1E293B"
                  })}
                >
                  {date.toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                  })}
                </Box>
              );
            }
          }
        ]
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableRowActions: true,
    enableEditing: true,
    createDisplayMode: "row",
    editDisplayMode: "row",
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"]
      },
      pagination: {
        pageIndex: 0,
        pageSize: 4
      }
    },
    state: {
      showProgressBars: isLoading || loading,
      showSkeletons: isLoading || loading,
      showLoadingOverlay: loading
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Button
          color="error"
          onClick={() => {
            deleteCompany({
              id: row.original.id
            });
            table.setEditingRow(null);
          }}
          variant="contained"
        >
          <DeleteRoundedIcon></DeleteRoundedIcon>
        </Button>
        <Button
          color="primary"
          onClick={() => {
            table.setEditingRow(row);
          }}
          variant="contained"
        >
          <EditRoundedIcon></EditRoundedIcon>
        </Button>
        {row.original.is_active ? (
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              setLoading(true);

              updateCompany({
                is_active: false,
                id: row.original.id,
                name: row.original.name,
                email: row.original.email,
                address: row.original.address,
                phone: row.original.phone
              });
              table.setEditingRow(null);

              setLoading(false);
            }}
          >
            <CloudOffRoundedIcon></CloudOffRoundedIcon>
          </Button>
        ) : (
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setLoading(true);

              updateCompany({
                is_active: true,
                id: row.original.id,
                name: row.original.name,
                email: row.original.email,
                address: row.original.address,
                phone: row.original.phone
              });

              setLoading(false);
            }}
          >
            <CloudSyncRoundedIcon></CloudSyncRoundedIcon>
          </Button>
        )}
      </Box>
    ),
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined"
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [4],
      shape: "rounded",
      variant: "outlined"
    },
    onCreatingRowSave: async ({ values }) => {
      setLoading(true);
      const newCompany = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address
      };

      try {
        createCompany(newCompany);
        table.setCreatingRow(null);
      } catch (error) {
        console.error("Error creating company:", error);
      }

      setLoading(false);
    },
    onEditingRowSave: async ({ values }) => {
      setLoading(true);
      const updatedCompany = {
        id: values.id,
        name: values.name,
        is_active: values.is_active,
        email: values.email,
        address: values.address,
        phone: values.phone
      };

      try {
        updateCompany(updatedCompany);
        table.setEditingRow(null);
      } catch (error) {
        console.error("Error updating company:", error);
      }

      setLoading(false);
    },
    renderTopToolbar: ({ table }) => {
      const handleAddingNewCompany = () => {
        table.setCreatingRow(true);
      };

      return (
        <Box
          sx={() => ({
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between"
          })}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center"
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  const supabase = createClient();
                  supabase.auth.signOut();
                  router.push("/login");
                }}
              >
                <LogoutRoundedIcon></LogoutRoundedIcon>
              </Button>
              <Button
                color="success"
                onClick={handleAddingNewCompany}
                variant="contained"
                sx={{
                  color: "white"
                }}
              >
                <AddBoxRoundedIcon
                  sx={{
                    marginRight: ".5rem"
                  }}
                ></AddBoxRoundedIcon>
                <span>Add new company</span>
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
    renderBottomToolbar: ({ table }) => (
      <Box
        sx={() => ({
          display: "flex",
          gap: "0.5rem",
          p: "8px",
          justifyContent: "space-between"
        })}
      >
        <MRT_TablePagination table={table} />
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "1rem"
          }}
        >
          <Image
            src={"/logo.png"}
            alt="Meeting master logo"
            width={120}
            height={100}
          ></Image>
        </Box>
      </Box>
    )
  });

  return <MaterialReactTable table={table} />;
};

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Company } from "@/types";
import { useUpdateCompany } from "@/hooks/company/useUpdateCompany";
import { useDeleteCompany } from "@/hooks/company/useDeleteCompany";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CompanyTableComponent = (props: {
  data: Company[];
  isLoading: boolean;
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Container maxWidth="xl">
      <CompanyTable data={props.data} isLoading={props.isLoading} />
    </Container>
  </LocalizationProvider>
);

export default CompanyTableComponent;
