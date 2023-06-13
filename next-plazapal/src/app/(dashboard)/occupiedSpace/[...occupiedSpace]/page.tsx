import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import params from "next/router";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const formatDate = (date: any) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const OccupiedSpacePage = async ({
  params,
}: {
  params: { occupiedSpace: string };
}) => {
  const occupiedSpace = await db.occupiedSpace.findUnique({
    where: {
      SpaceID: Number(params.occupiedSpace),
    },
  });

  if (!occupiedSpace) return notFound();
  else {
    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-7xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-6xl"
            >
              <p>Space ID: {Number(occupiedSpace.SpaceID)}</p>
              <p>Date Opened: {occupiedSpace.DateOpened.toDateString()}</p>
              <p>Open Time: {formatDate(occupiedSpace.OpenTime)}</p>
              <p>Close Time: {formatDate(occupiedSpace.CloseTime)}</p>
              <p>Shop ID: {Number(occupiedSpace.ShopID)}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/occupiedSpace"
            >
              Back to occupied spaces
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default OccupiedSpacePage;
