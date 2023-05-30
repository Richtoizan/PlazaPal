import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { db } from "@/lib/db";
import { Shop } from "@prisma/client";
import { notFound } from "next/navigation";
import params from "next/router";

const ShopPage = async ({ params }: { params: { shop: string } }) => {
  const shop = await db.shop.findUnique({
    where: {
      ID: Number(params.shop),
    },
  });

  if (!shop) return notFound();
  else
    return (
      <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
        <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
          <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-2xl"
            >
              <p>{shop.Name}</p>
              <p>Sector: {shop.Sector}</p>
              <p>Owned By: {shop.OwnedBy.toString()}</p>
            </LargeHeading>
            <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
          </div>
          <div className="relative h-screen flex items-center justify-center overflow-x-hidden"></div>
        </div>
      </div>
    );
};

export default ShopPage;
