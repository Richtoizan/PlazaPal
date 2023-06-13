"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { ChangeEvent } from "react";
import LargeHeading from "@/components/ui/LargeHeading";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

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

  const [occupiedSpace, setOccupiedSpace] = useState({
    spaceId: "",
    dateOpened: new Date(),
    openTime: new Date(),
    closeTime: new Date(),
    shopId: "",
  });

  const router = useRouter();

  const pathname = usePathname();
  const pathNames = pathname ? pathname.split("/") : [];
  const spaceId = pathname ? pathNames[pathNames.length - 1] : null;

  useEffect(() => {
    const fetchOccupiedSpace = async () => {
      const endpoint = "/api/occupiedSpace?id=" + spaceId;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setOccupiedSpace(result);
    };
    fetchOccupiedSpace();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = {
      spaceId: Number(occupiedSpace.spaceId),
      shopId: Number(occupiedSpace.shopId),
      dateOpened: new Date(occupiedSpace.dateOpened),
      openTime: new Date(occupiedSpace.openTime),
      closeTime: new Date(occupiedSpace.closeTime),
    };

    const endpoint = "/api/occupiedSpace?id=" + spaceId;
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
      router.push("/occupiedSpace/" + spaceId);
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
              Edit Occupied Space
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Edit the details of the occupied space</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="my-4">
                    <Label htmlFor="spaceId">Space ID</Label>
                    <Input
                      id="spaceId"
                      name="spaceId"
                      type="number"
                      value={occupiedSpace.spaceId}
                      onChange={handleOccupiedSpaceChange}
                      required
                    />
                  </div>
                  <div className="my-4">
                    <Label htmlFor="shopId">Shop ID</Label>
                    <Input
                      id="shopId"
                      name="shopId"
                      type="number"
                      value={occupiedSpace.shopId}
                      onChange={handleOccupiedSpaceChange}
                      required
                    />
                  </div>
                  <div className="my-4">
                    <Label htmlFor="dateOpened">Date Opened</Label>
                    <TextField
                      id="dateOpened"
                      name="dateOpened"
                      type="date"
                      value={occupiedSpace.dateOpened}
                      onChange={handleOccupiedSpaceChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="my-4">
                    <Label htmlFor="openTime">Open Time</Label>
                    <TextField
                      id="openTime"
                      name="openTime"
                      type="time"
                      value={occupiedSpace.openTime}
                      onChange={handleOccupiedSpaceChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="my-4">
                    <Label htmlFor="closeTime">Close Time</Label>
                    <TextField
                      id="closeTime"
                      name="closeTime"
                      type="time"
                      value={occupiedSpace.closeTime}
                      onChange={handleOccupiedSpaceChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="flex justify-center items-center mt-6">
                    <Button
                      color={resolvedTheme === "dark" ? "light" : "dark"}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                    <Link href="/occupiedSpace">
                      <Button
                        color={resolvedTheme === "dark" ? "light" : "dark"}
                        className="ml-4"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  );
}
