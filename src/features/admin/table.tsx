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
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  MenuItem,
  lighten
} from "@mui/material";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";

const CompanyTable = (props: { data: Company[]; isLoading: boolean }) => {
  const { data, isLoading } = props;

  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        id: "companies",
        header: "Companies",
        columns: [
          {
            accessorKey: "name",
            id: "name",
            header: "Name",
            size: 200,
            enableEditing: true
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
                  backgroundColor:
                    renderedCellValue === "true" ? "#10B981" : "#EF4444",
                  borderRadius: "0.25rem",
                  color: "#fff",
                  p: ".5rem 5rem"
                })}
              >
                {renderedCellValue === "true" ? "Active" : "Inactive"}
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
                  sx={(theme) => ({
                    backgroundColor: theme.palette.info.dark,
                    borderRadius: "0.25rem",
                    color: "#fff",
                    maxWidth: "9ch",
                    p: ".5rem 5rem"
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
    enableRowSelection: true,
    enableEditing: true,
    editDisplayMode: "row",
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"]
      }
    },
    state: {
      showProgressBars: isLoading,
      showSkeletons: isLoading
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined"
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined"
    },

    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Profile
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Send Email
      </MenuItem>
    ],
    renderTopToolbar: ({ table }) => {
      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between"
          })}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="success"
                onClick={handleActivate}
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
