import Head from "next/head";
import { Inter } from "next/font/google";
import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import Link from "next/link";
import Image from "next/image";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PlazaPal",
  description: "PlazaPal is a platform for managing shopping centers",
};

export default function Home() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-black dark:text-light-gold max-w-2xl"
          >
            Manage your shopping center with ease
          </LargeHeading>
          <Paragraph className="max-w-xl lg:text-left">
            Enjoy complete control over your branches, shops, employees and more
            with your{" "}
            <Link
              href="/api/auth/signin"
              className="underline underline-offset-2 text-black dark:text-light-gold"
            >
              account
            </Link>
            .
          </Paragraph>
          <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute">
            <Image
              priority
              className="img-shadow"
              quality={100}
              style={{ objectFit: "contain" }}
              fill
              src="/plaza.png"
              alt="plaza"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
