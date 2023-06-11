import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { db } from "@/lib/db";
import { Shop } from "@prisma/client";
import { notFound } from "next/navigation";
import params from "next/router";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const formatDate = (date: any) => {
  const d = new Date(date);
  const dayWeek = d.toLocaleString("en-US", { weekday: "long" });
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return `${dayWeek} ${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;
};

const BranchPage = async ({ params }: { params: { branch: string } }) => {
  const branch = await db.branch.findUnique({
    where: {
      ID: Number(params.branch),
    },
  });

  if (!branch) return notFound();
  else {
    const admin = await db.admin.findUnique({
      where: {
        ID: branch.ManagedBy,
      },
    });

    const managedBy = admin
      ? admin.Name + " " + admin.Surname
      : branch.ManagedBy;

    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-9xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-9xl"
            >
              <p>Branch ID: {Number(branch.ID)}</p>
              <p>Locartion: {branch.Location}</p>
              <p>Date Opened: {formatDate(branch.DateOpened)}</p>
              <p>Managed By: {managedBy.toString()}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/branch"
            >
              Back to branches
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default BranchPage;
