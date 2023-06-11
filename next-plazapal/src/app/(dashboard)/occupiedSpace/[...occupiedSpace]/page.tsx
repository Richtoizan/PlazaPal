import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import params from "next/router";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const ShopPage = async ({ params }: { params: { shop: string } }) => {
  const shop = await db.shop.findUnique({
    where: {
      ID: Number(params.shop),
    },
  });

  if (!shop) return notFound();
  else {
    const owner = await db.shopOwner.findUnique({
      where: {
        ID: shop.OwnedBy,
      },
    });

    const ownedBy = owner ? owner.Name + " " + owner.Surname : shop.OwnedBy;

    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-7xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-2xl"
            >
              <p>{shop.Name}</p>
              <p>Sector: {shop.Sector}</p>
              <p>Owned By: {ownedBy.toString()}</p>
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

export default ShopPage;
