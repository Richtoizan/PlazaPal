import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";
import { ShopOwner } from "@prisma/client";
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
  { field: "location", headerName: "Location", width: 200 },
  { field: "floor", headerName: "Floor", width: 200 },
  { field: "branchID", headerName: "Branch ID", width: 150 },
  { field: "area", headerName: "Area", width: 200 },
];

const columnLinks = [
  {
    index: 0,
    link: "space",
    textField: "id",
  },
];

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const tuples = await db.space.findMany();

  const rows = tuples.map((t) => ({
    id: Number(t.ID),
    location: t.Location,
    floor: t.Floor,
    branchID: Number(t.BranchID),
    area: Number(t.AreaSquareMeter),
  }));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full ">
        <Paragraph className="text-center md:text-left mt-4 -mb-4 space-x-10">
          Space Table{"    "}
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/space/new"
          >
            + Add Space
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
