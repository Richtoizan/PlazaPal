"use client";

import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import LargeHeading from "@/components/ui/LargeHeading";
import { cn } from "@/lib/utils";

export default function Page() {
  const { resolvedTheme } = useTheme();

  const [saveShopOwner, setSaveShopOwner] = useState({
    name: "",
    surname: "",
    email: "",
    telephoneNo: "",
  });

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const endpoint = "/api/mallStaff";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveShopOwner),
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    router.push("/mallStaff");
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveShopOwner({ ...saveShopOwner, [name]: value });
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-x-hidden">
      <div className="container pt-24 max-w-7xl mx-auto w-full">
        <div className="gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start dark:text-white">
          <LargeHeading
            size="lg"
            className="text-black dark:text-white max-w-2xl py-10"
          >
            Add Mall Staff
          </LargeHeading>
          <Card className="border-black dark:border-white">
            <CardHeader>
              <CardTitle>Enter the details of the new Mall Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      id="name"
                      value={saveShopOwner.name}
                      onChange={handleSaveChange}
                      placeholder="Name of the Mall Staff"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      name="surname"
                      id="surname"
                      value={saveShopOwner.surname}
                      onChange={handleSaveChange}
                      placeholder="Surname of the Mall Staff"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      id="email"
                      value={saveShopOwner.email}
                      onChange={handleSaveChange}
                      placeholder="Email of the Mall Staff"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="telephoneNo">Telephone Number</Label>
                    <Input
                      name="telephoneNo"
                      id="telephoneNo"
                      value={saveShopOwner.telephoneNo}
                      onChange={handleSaveChange}
                      placeholder="Telephone Number of the Mall Staff"
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
