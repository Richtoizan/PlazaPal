import LargeHeading from "@/components/ui/LargeHeading";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const SpacePage = async ({ params }: { params: { space: string } }) => {
  const space = await db.space.findUnique({
    where: {
      ID: Number(params.space),
    },
  });

  if (!space) return notFound();
  else {
    const branch = await db.branch.findUnique({
      where: {
        ID: space.BranchID,
      },
    });

    const branchLocation = branch ? branch.Location : space.BranchID;

    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-7xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-5xl"
            >
              <p>ID: {Number(space.ID)}</p>
              <p>Location: {space.Location}</p>
              <p>Floor: {space.Floor}</p>
              <p>Branch : {Number(space.BranchID)}</p>
              <p>Area in Square Meters: {space.AreaSquareMeter}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/space"
            >
              Back to spaces
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default SpacePage;
