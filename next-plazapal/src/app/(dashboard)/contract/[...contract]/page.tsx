import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { db } from "@/lib/db";
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

const ContractPage = async ({ params }: { params: { contract: string } }) => {
  const contract = await db.contract.findUnique({
    where: {
      ID: Number(params.contract),
    },
  });

  if (!contract) return notFound();
  else {
    const owner = await db.shopOwner.findUnique({
      where: {
        ID: contract.OwnerID,
      },
    });

    const ownedBy = owner ? owner.Name + " " + owner.Surname : contract.OwnerID;

    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-7xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-2xl"
            >
              <p>Contract ID: {contract.ID.toString()}</p>
              <p>Start Date: {formatDate(contract.StartDate)}</p>
              <p>End Date: {formatDate(contract.EndDate)}</p>
              <p>Fee: {contract.Fee.toString()}</p>
              <p>Payment Frequency: {contract.PaymentFrequency}</p>
              <p>Space ID: {contract.SpaceID.toString()}</p>
              <p>Owned By: {ownedBy.toString()}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/contract"
            >
              Back to contracts
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default ContractPage;
