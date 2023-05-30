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
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-black dark:text-light-gold max-w-2xl"
          >
            Welcome, {user.user.name}
          </LargeHeading>
          <Link className={buttonVariants({ variant: "ghost" })} href="/shop">
            Shop
          </Link>
          <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
        </div>
        <div className="relative h-screen flex items-center justify-center overflow-x-hidden"></div>
      </div>
    </div>
  );
};
export default page;
