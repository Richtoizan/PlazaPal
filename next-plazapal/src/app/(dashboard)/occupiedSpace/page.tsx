import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Table from "@/components/ui/Table";
import Paragraph from "@/components/ui/Paragraph";
import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "PlazaPal | Dashboard",
  description: "Manage your shopping centers with ease",
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Space ID", width: 130 },
  { field: "dateOpened", headerName: "Date Opened", width: 200 },
  { field: "openTime", headerName: "Open Time", width: 200 },
  { field: "closeTime", headerName: "Close Time", width: 200 },
  { field: "shopID", headerName: "Shop ID", width: 130 },
];

const formatDate = (date: any) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const columnLinks = [
  {
    index: 0,
    link: "occupiedSpace",
    textField: "id",
  },
  {
    index: 4,
    link: "shop",
    textField: "shopID",
  },
];

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const tuples = await db.occupiedSpace.findMany({
    include: {
      Shop: {
        select: {
          ID: true,
        },
      },
      Space: {
        select: {
          ID: true,
        },
      },
    },
  });

  const rows = tuples.map((t) => ({
    id: Number(t.SpaceID),
    dateOpened: t.DateOpened,
    openTime: formatDate(t.OpenTime),
    closeTime: formatDate(t.CloseTime),
    shopID: Number(t.ShopID),
  }));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full ">
        <Paragraph className="text-center md:text-left mt-4 -mb-4 space-x-10">
          Occupied Space Table{"    "}
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/occupiedSpace/new"
          >
            + Add Occupied Space
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
