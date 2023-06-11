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

  const [saveAdmin, setSaveAdmin] = useState({
    name: "",
    surname: "",
    email: "",
    telephoneNo: "",
    isMallOwner: false,
    password: "",
  });

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const endpoint = "/api/admin";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveAdmin),
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    router.push("/admin");
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveAdmin({ ...saveAdmin, [name]: value });
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-x-hidden">
      <div className="container pt-24 max-w-7xl mx-auto w-full">
        <div className="gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start dark:text-white">
          <LargeHeading
            size="lg"
            className="text-black dark:text-white max-w-2xl py-10"
          >
            Add Admin
          </LargeHeading>
          <Card className="border-black dark:border-white">
            <CardHeader>
              <CardTitle>Enter the details of the new Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      id="name"
                      value={saveAdmin.name}
                      onChange={handleSaveChange}
                      placeholder="Name of the Admin"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      name="surname"
                      id="surname"
                      value={saveAdmin.surname}
                      onChange={handleSaveChange}
                      placeholder="Surname of the Admin"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      id="email"
                      value={saveAdmin.email}
                      onChange={handleSaveChange}
                      placeholder="Email of the Admin"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="telephoneNo">Telephone Number</Label>
                    <Input
                      name="telephoneNo"
                      id="telephoneNo"
                      value={saveAdmin.telephoneNo}
                      onChange={handleSaveChange}
                      placeholder="Telephone Number of the Admin"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      name="password"
                      id="password"
                      value={saveAdmin.password}
                      onChange={handleSaveChange}
                      placeholder="Password for the Admin"
                      type="password"
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin"
          >
            Back to admins
          </Link>
        </div>
      </div>
    </div>
  );
}
