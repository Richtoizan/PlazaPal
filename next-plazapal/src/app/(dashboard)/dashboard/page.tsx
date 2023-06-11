import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LargeHeading from "@/components/ui/LargeHeading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import Paragraph from "@/components/ui/Paragraph";

export const metadata: Metadata = {
  title: "PlazaPal | Dashboard",
  description: "Manage your shopping centers with ease",
};

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-24 max-w-7xl mx-auto w-full">
        <div className="gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-black dark:text-light-gold max-w-2xl"
          >
            Welcome, {user.user.name}, what would you like to manage today?
          </LargeHeading>
          <div className="max-w-2xl">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/shop"
            >
              Shops
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/shopOwner"
            >
              Shop Owners
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/contract"
            >
              Contracts
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/contractPayment"
            >
              Contract Payments
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/branch"
            >
              Branches
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/space"
            >
              Spaces
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/occupiedSpace"
            >
              Occupied Spaces
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/mallStaff"
            >
              Mall Staff
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/shopStaff"
            >
              Shop Staff
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/sensor"
            >
              Sensors
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/sensorData"
            >
              Sensor Data
            </Link>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/admin"
            >
              Admins
            </Link>
          </div>

          <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
        </div>
      </div>
    </div>
  );
};
export default page;
