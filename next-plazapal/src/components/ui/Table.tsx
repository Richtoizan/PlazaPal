'use client'

import { createTheme, ThemeProvider } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTheme } from 'next-themes'
import { FC } from 'react'
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";

interface TableProps {
  rows: any,
  columns: GridColDef[],
  columnLinks: {
    index: number,
    link: string,
    textField: string,
  }[],
}

const Table: FC<TableProps> = ({ rows, columns, columnLinks }) => {
  const { theme: applicationTheme } = useTheme()

  const darkTheme = createTheme({
    palette: {
      mode: applicationTheme === 'light' ? 'light' : 'dark',
    },
  })

  // Update the renderCell callback for the columns that have links
  columnLinks.forEach(({ index, link, textField }) => {
    columns[index].renderCell = (params) => {
      // Example link: /shop/1
      return (<Link
        href={`/${link}/${params.value}`}>
        {params.row[textField]}
      </Link>)
    }
  })

  // Add edit button column
  columns.push({ field: "edit", headerName: "", width: 200 });
  columns[columns.length - 1].renderCell = (params) => {
    return (<Link
      className={buttonVariants({ variant: "outline" })}
      href={`/${columnLinks[0].link}/edit/${params.row.id}`}>
      Edit
    </Link>)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <DataGrid
        style={{
          backgroundColor: applicationTheme === 'light' ? 'white' : '#152238',
          fontSize: '1rem',
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
  )
}

export default Table
