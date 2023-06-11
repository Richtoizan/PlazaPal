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
import { useRouter } from "next/navigation";
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

    fetchOwners();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = { ...saveShop, ownedBy: Number(saveShop.ownedBy) };

    console.log("Data to send:", dataToSend);

    const endpoint = "/api/occupiedSpace";
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

    router.push("/occupiedSpace");
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
              Add Occupied Space
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Enter the details of the new shop</CardTitle>
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
                        placeholder="Name of the shop"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        name="sector"
                        id="sector"
                        value={saveShop.sector}
                        onChange={handleSaveChange}
                        placeholder="Sector of the shop"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 dark:text-white">
                      <Label htmlFor="ownedBy" id="ownedBy-select-label">
                        Owner
                      </Label>
                      <Select
                        name="ownedBy"
                        labelId="ownedBy-select-label"
                        id="ownedBy-select"
                        value={saveShop.ownedBy}
                        label="Owner"
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
