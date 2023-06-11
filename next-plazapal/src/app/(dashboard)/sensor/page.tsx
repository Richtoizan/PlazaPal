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
  { field: "name", headerName: "Name", width: 300 },
  { field: "sector", headerName: "Sector", width: 300 },
  { field: "ownedby", headerName: "Owned By", width: 300 },
];

const columnLinks = [
  {
    index: 0,
    link: "shop",
    textField: "id",
  },
  {
    index: 3,
    link: "shopOwner",
    textField: "ownerName",
  },
];

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const tuples = await db.shop.findMany({
    include: {
      ShopOwner: {
        select: {
          Name: true,
          Surname: true,
        },
      },
    },
  });

  const rows = tuples.map((t) => ({
    id: Number(t.ID),
    name: t.Name,
    sector: t.Sector,
    ownedby: Number(t.OwnedBy),
    ownerName: t.ShopOwner.Name + " " + t.ShopOwner.Surname,
  }));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full ">
        <Paragraph className="text-center md:text-left mt-4 -mb-4 space-x-10">
          Sensor Table{"    "}
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/sensor/new"
          >
            + Add Sensor
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
