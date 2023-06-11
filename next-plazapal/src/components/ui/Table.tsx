"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC } from "react";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TableProps {
  rows: any;
  columns: GridColDef[];
  columnLinks: {
    index: number;
    link: string;
    textField: string;
  }[];
}

const Table: FC<TableProps> = ({ rows, columns, columnLinks }) => {
  const { theme: applicationTheme } = useTheme();

  const darkTheme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });

  const router = useRouter();

  // Update the renderCell callback for the columns that have links
  columnLinks.forEach(({ index, link, textField }) => {
    columns[index].renderCell = (params) => {
      // Example link: /shop/1
      return (
        <Link href={`/${link}/${params.value}`}>{params.row[textField]}</Link>
      );
    };
  });

  const handleDelete = async (link: any, id: any) => {
    try {
      const response = await fetch(`/api/${link}/?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Deleted successfully
        // Refresh page
        router.push(`/${link}`);
      } else {
        // TODO: notify the admin about failure due to constraints
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (!columns.find((value) => {value.field == "edit"})) {
    // Add edit button column
    columns.push({ field: "edit", headerName: "", width: 100 });
    columns[columns.length - 1].renderCell = (params) => {
      return (
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/${columnLinks[0].link}/edit/${params.row.id}`}
        >
          Edit
        </Link>
      );
    };
  }

  if (!columns.find((value) => {value.field == "delete"})) {
    // Add delete button column
    columns.push({ field: "delete", headerName: "", width: 100 });
    columns[columns.length - 1].renderCell = (params) => {
      return (
        <button
          className={buttonVariants({ variant: "outline" })}
          onClick={() => handleDelete(columnLinks[0].link, params.row.id)}
        >
          Delete
        </button>
      );
    };
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <DataGrid
        style={{
          backgroundColor: applicationTheme === "light" ? "white" : "#152238",
          fontSize: "1rem",
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        columns={columns}
        rows={rows}
      />
    </ThemeProvider>
  );
};

export default Table;
