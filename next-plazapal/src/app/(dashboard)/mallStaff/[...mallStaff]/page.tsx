import LargeHeading from "@/components/ui/LargeHeading";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import params from "next/router";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const ShopOwnerPage = async ({ params }: { params: { shopOwner: string } }) => {
  const shopOwner = await db.shopOwner.findUnique({
    where: {
      ID: Number(params.shopOwner),
    },
  });

  if (!shopOwner) return notFound();
  else {
    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-9xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-9xl"
            >
              <p>Mall Staff ID: {Number(shopOwner.ID)}</p>
              <p>Name: {shopOwner.Name}</p>
              <p>Surname: {shopOwner.Surname}</p>
              <p>Email: {shopOwner.Email}</p>
              <p>Telephone Number: {shopOwner.TelephoneNo}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/mallStaff"
            >
              Back to Mall Staff
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default ShopOwnerPage;
