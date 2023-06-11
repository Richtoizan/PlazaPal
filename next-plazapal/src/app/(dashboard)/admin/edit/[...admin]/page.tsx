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
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import LargeHeading from "@/components/ui/LargeHeading";

const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default function Page() {
  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  const [saveAdmin, setSaveAdmin] = useState({
    name: "",
    surname: "",
    email: "",
    telephoneNo: "",
    isMallOwner: false,
    password: "",
  });

  const router = useRouter();

  const pathname = usePathname();
  const pathNames = pathname ? pathname.split("/") : [];
  const adminId = pathname ? pathNames[pathNames.length - 1] : null;

  useEffect(() => {
    const fetchAdmin = async () => {
      const endpoint = "/api/admin?id=" + adminId;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setSaveAdmin(result);
    };

    fetchAdmin();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = {
      ...saveAdmin,
    };

    console.log("Data to send:", dataToSend);

    const endpoint = "/api/admin?id=" + adminId;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    router.push("/admin/" + adminId);
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveAdmin({ ...saveAdmin, [name]: value });
  };

  const handleSaveChangeSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSaveAdmin({ ...saveAdmin, [name]: Boolean(value) });
  };

  return (
    isMounted && (
      <div className="relative min-h-screen flex items-start justify-center overflow-x-hidden">
        <div className="container pt-24 max-w-7xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start dark:text-white">
            <LargeHeading
              size="lg"
              className="text-black dark:text-white max-w-2xl py-10"
            >
              Edit Admin
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Edit the details of the admin</CardTitle>
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
                        // placeholder="Admin name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        name="surname"
                        id="surname"
                        value={saveAdmin.surname}
                        onChange={handleSaveChange}
                        // placeholder="Admin surname"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        name="email"
                        id="email"
                        value={saveAdmin.email}
                        onChange={handleSaveChange}
                        // placeholder="Admin email"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="telephoneNo">Telephone Number</Label>
                      <Input
                        name="telephoneNo"
                        id="telephoneNo"
                        value={saveAdmin.telephoneNo}
                        onChange={handleSaveChange}
                        // placeholder="Admin telephone number"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="isMallOwner">Is Mall Owner</Label>
                      <Select
                        name="isMallOwner"
                        id="isMallOwner-select"
                        value={saveAdmin.isMallOwner ? "true" : "false"}
                        label="Is Mall Owner"
                        onChange={handleSaveChangeSelect}
                        className="border-gray-800 dark:text-white"
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused fieldset, & .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor:
                                resolvedTheme === "dark" ? "white" : "black",
                            },
                          "& .MuiSelect-icon": {
                            color: resolvedTheme === "dark" ? "white" : "black",
                          },
                        }}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="telephoneNo">Password</Label>
                      <Input
                        name="password"
                        id="password"
                        value={saveAdmin.password}
                        type="password"
                        onChange={handleSaveChange}
                        // placeholder="Admin password"
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
    )
  );
}
