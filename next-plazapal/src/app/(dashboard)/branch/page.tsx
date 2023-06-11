import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";
import { Admin } from "@prisma/client";
import { buttonVariants } from "@/components/ui/Button";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Table from "@/components/ui/Table";
import Paragraph from "@/components/ui/Paragraph";
import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PlazaPal | Dashboard",
  description: "Manage your shopping centers with ease",
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 130 },
  { field: "location", headerName: "Location", width: 300 },
  { field: "dateopened", headerName: "Date Opened", width: 300 },
  { field: "managedby", headerName: "Managed By", width: 300 },
];

const formatDate = (date: any) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1; // Months are zero indexed in JavaScript
  const year = d.getFullYear();

  // Use String.padStart() for '0' padding
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
};

const columnLinks = [
  {
    index: 0,
    link: "branch",
    textField: "id",
  },
  {
    index: 3,
    link: "admin",
    textField: "managerName",
  },
];

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const tuples = await db.branch.findMany({
    include: {
      Admin: {
        select: {
          Name: true,
          Surname: true,
        },
      },
    },
  });

  const rows = tuples.map((t) => ({
    id: Number(t.ID),
    location: t.Location,
    dateopened: formatDate(t.DateOpened),
    managedby: Number(t.ManagedBy),
    managerName: t.Admin.Name + " " + t.Admin.Surname,
  }));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full ">
        <Paragraph className="text-center md:text-left mt-4 -mb-4 space-x-10">
          Branch Table{"    "}
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/branch/new"
          >
            + Add Branch
          </Link>
        </Paragraph>
        <div className="py-10 relative w-90 max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
        <div className="py-10 max-w-full">
          <Table rows={rows} columns={columns} columnLinks={columnLinks} />
        </div>
      </div>
    </div>
  );
};
export default page;
