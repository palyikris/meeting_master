import { useMemo } from "react";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from "material-react-table";

//Material UI Imports
import { Box, Button, Container, lighten } from "@mui/material";
import { useCreateCompany } from "@/hooks/company/useCreateCompany";

const CompanyTable = (props: { data: Company[]; isLoading: boolean }) => {
  const { data, isLoading } = props;

  const { mutate: createCompany, isPending: isCreateCompanyPending } =
    useCreateCompany();

  const { mutate: updateCompany, isPending: isUpdateCompanyPending } =
    useUpdateCompany();

  const { mutate: deleteCompany, isPending: isDeleteCompanyPending } =
    useDeleteCompany();

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
            size: 150,
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
            accessorKey: "is_active",
            header: "Active",
            size: 100,
            enableEditing: true,
            editVariant: "select",
            editSelectOptions: [
              { value: true, label: "Active" },
              { value: false, label: "Inactive" }
            ],
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
      }
    },
    state: {
      showProgressBars:
        isLoading ||
        isCreateCompanyPending ||
        isUpdateCompanyPending ||
        isDeleteCompanyPending,
      showSkeletons:
        isLoading ||
        isCreateCompanyPending ||
        isUpdateCompanyPending ||
        isDeleteCompanyPending
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
          Delete
        </Button>
        <Button
          color="primary"
          onClick={() => {
            table.setEditingRow(row);
          }}
          variant="contained"
        >
          Edit
        </Button>
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
      const newCompany = {
        name: values.name
      };

      try {
        createCompany(newCompany);
        table.setCreatingRow(null);
      } catch (error) {
        console.error("Error creating company:", error);
      }
    },
    onEditingRowSave: async ({ values }) => {
      const updatedCompany = {
        id: values.id,
        name: values.name,
        is_active: values.is_active
      };

      console.log("Updated company:", updatedCompany);

      try {
        updateCompany(updatedCompany);
        table.setEditingRow(null);
      } catch (error) {
        console.error("Error updating company:", error);
      }
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
              // background:
              //   "background: linear-gradient($deg, $color-primary 50%, $color-success 100%)"
            }}
          >
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="success"
                onClick={handleAddingNewCompany}
                variant="contained"
                sx={{
                  color: "white"
                }}
              >
                Add new
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }
  });

  return <MaterialReactTable table={table} />;
};

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Company } from "@/types";
import { useUpdateCompany } from "@/hooks/company/useUpdateCompany";
import { useDeleteCompany } from "@/hooks/company/useDeleteCompany";

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
