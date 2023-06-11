import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";
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
  { field: "startDate", headerName: "Start Date", width: 200 },
  { field: "endDate", headerName: "End Date", width: 200 },
  { field: "fee", headerName: "Fee", width: 150 },
  { field: "paymentFrequency", headerName: "Payment Frequency", width: 200 },
  { field: "spaceId", headerName: "Space ID", width: 130 },
  { field: "ownerId", headerName: "Owner", width: 200 },
];

const columnLinks = [
  {
    index: 0,
    link: "contract",
    textField: "id",
  },
  {
    index: 5,
    link: "space",
    textField: "spaceId",
  },
  {
    index: 6,
    link: "shopOwner",
    textField: "ownerName",
  },
];

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const tuples = await db.contract.findMany({
    include: {
      ShopOwner: {
        select: {
          Name: true,
          Surname: true,
        },
      },
    },
  });

  const rows = tuples.map((contract) => ({
    id: Number(contract.ID),
    startDate: contract.StartDate.toDateString(),
    endDate: contract.EndDate.toDateString(),
    fee: Number(contract.Fee),
    paymentFrequency: contract.PaymentFrequency,
    spaceId: Number(contract.SpaceID),
    ownerId: Number(contract.OwnerID),
    ownerName: contract.ShopOwner.Name + " " + contract.ShopOwner.Surname,
  }));

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full ">
        <Paragraph className="text-center md:text-left mt-4 -mb-4 space-x-10">
          Contract Payment Table{"    "}
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/contractPayment/new"
          >
            + Add Contract Payment
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
