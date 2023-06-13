"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import LargeHeading from "@/components/ui/LargeHeading";
import TextField from "@mui/material/TextField";

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
  const router = useRouter();

  const [occupiedSpace, setOccupiedSpace] = useState({
    spaceId: "",
    dateOpened: new Date(),
    openTime: new Date(),
    closeTime: new Date(),
    shopId: "",
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = {
      spaceId: Number(occupiedSpace.spaceId), // ensure this is included
      shopId: Number(occupiedSpace.shopId),
      dateOpened: new Date(occupiedSpace.dateOpened),
      openTime: new Date(occupiedSpace.openTime),
      closeTime: new Date(occupiedSpace.closeTime),
    };

    console.log(dataToSend);

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
      router.push("/occupiedSpace");
    }
  };

  const handleOccupiedSpaceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOccupiedSpace({ ...occupiedSpace, [name]: value });
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
                <CardTitle>
                  Enter the details of the new occupied space
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="spaceId">Space ID</Label>
                      <Input
                        name="spaceId"
                        id="spaceId"
                        value={occupiedSpace.spaceId}
                        onChange={handleOccupiedSpaceChange}
                        placeholder="Space ID"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dateOpened">Date Opened</Label>
                      <TextField
                        id="dateOpened"
                        type="date"
                        defaultValue={occupiedSpace.dateOpened}
                        onChange={handleOccupiedSpaceChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="openTime">Open Time</Label>
                      <TextField
                        id="openTime"
                        type="time"
                        defaultValue={occupiedSpace.openTime}
                        onChange={handleOccupiedSpaceChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="closeTime">Close Time</Label>
                      <TextField
                        id="closeTime"
                        type="time"
                        defaultValue={occupiedSpace.closeTime}
                        onChange={handleOccupiedSpaceChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="shopId">Shop ID</Label>
                      <Input
                        name="shopId"
                        id="shopId"
                        value={occupiedSpace.shopId}
                        onChange={handleOccupiedSpaceChange}
                        placeholder="Shop ID"
                      />
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
