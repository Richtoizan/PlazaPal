"use client";

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
import React, { use, useEffect, useState } from "react";
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
  const [saveShop, setSaveShop] = useState({
    name: "",
    sector: "",
    ownedBy: "",
  });

  const router = useRouter();

  const pathname = usePathname();
  const pathNames = pathname ? pathname.split("/") : [];
  const shopId = pathname ? pathNames[pathNames.length - 1] : null;

  const [owners, setOwners] = useState([
    {
      id: "",
      name: "",
      surname: "",
      email: "",
      telephoneNo: "",
    },
  ]);

  useEffect(() => {
    const fetchOwners = async () => {
      const endpoint = "/api/shopOwner";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setOwners(result);
    };

    const fetchShop = async () => {
      const endpoint = "/api/occupiedSpace?id=" + shopId;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setSaveShop(result);
    };

    fetchShop();
    fetchOwners();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = { ...saveShop, ownedBy: Number(saveShop.ownedBy) };

    const endpoint = "/api/occupiedSpace?id=" + shopId;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (result) {
    }

    router.push("/occupiedSpace/" + shopId);
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveShop({ ...saveShop, [name]: value });
  };

  const handleSaveChangeSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSaveShop({ ...saveShop, [name]: value });
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
              Edit Occupied Space
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Edit the details of the shop</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        name="name"
                        id="name"
                        value={saveShop.name}
                        onChange={handleSaveChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        name="sector"
                        id="sector"
                        value={saveShop.sector}
                        onChange={handleSaveChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ownedBy">Owner</Label>
                      <Select
                        name="ownedBy"
                        labelId="ownedBy-select-label"
                        id="ownedBy-select"
                        value={saveShop.ownedBy}
                        label="Owner"
                        onChange={handleSaveChangeSelect}
                        className="border-white dark:text-white"
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused fieldset, & .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput":
                            {
                              borderColor:
                                resolvedTheme === "dark" ? "white" : "black",
                            },
                          "& .MuiSelect-icon": {
                            color: resolvedTheme === "dark" ? "white" : "black",
                          },
                        }}
                      >
                        {owners.map((owner) => (
                          <MenuItem key={owner.id} value={owner.id}>
                            {owner.name} {owner.surname}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/occupiedSpace"
            >
              Back to occupied spaces
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
