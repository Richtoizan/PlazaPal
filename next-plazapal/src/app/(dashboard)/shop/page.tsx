import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";
import { ShopOwner } from "@prisma/client";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Table from "@/components/ui/Table";
import Paragraph from "@/components/ui/Paragraph";
import { GridColDef } from "@mui/x-data-grid";

export const metadata: Metadata = {
  title: "PlazaPal | Dashboard",
  description: "Manage your shopping centers with ease",
};

// Column definitions
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 400, },
  { field: 'name', headerName: 'Name', width: 250, },
  { field: 'sector', headerName: 'Sector', width: 250, },
  { field: 'ownedby', headerName: 'OwnedBy', width: 250, },
];

// Links for each column
const columnLinks = [
  {
    index: 0, // id
    link: 'shop'
  },
  {
    index: 3, // ownedby
    link: 'shopowner'
  }
];

// TODO: use this function to change the display of the ownedby attribute
const displayShopOwner = (o: ShopOwner | null) => {
  if (!o)
    return 'undefined';

  return o.Name + ' ' + o.Surname;
};

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  // TODO: only get the shops that have an occupied space in this admin's branch
  const tuples = await db.shop.findMany();

  // Build up the rows from the shops in the database
  const rows = tuples.map((t) => ({
    id: (Number)(t.ID),
    name: t.Name,
    sector: t.Sector,
    ownedby: (Number)(t.OwnedBy),
  }));

  // TODO: reuse the following code to get a reference to the shop owner of each shop

  // const rows = await Promise.all(tuples.map(async (t) => ({
  //   id: (Number)(t.ID),
  //   name: t.Name,
  //   sector: t.Sector,

  //   // Find the shop owner of this shop
  //   ownedby: await db.shopOwner.findUnique({
  //     where: {
  //       ID: t.OwnedBy
  //     }
  //   }),
  // })));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
        <Paragraph className='text-center md:text-left mt-4 -mb-4'>
          Shop table
        </Paragraph>
        <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
        <Table rows={rows} columns={columns} columnLinks={columnLinks} />
      </div>
    </div>
  );
};
export default page;
