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

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

export default function Page() {
  const [saveShop, setSaveShop] = useState({
    name: "",
    sector: "",
    ownedBy: "",
  });

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = { ...saveShop, ownedBy: Number(saveShop.ownedBy) };

    console.log("Data to send:", dataToSend);

    const endpoint = "/api/shop";
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

    router.push("/shop");
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveShop({ ...saveShop, [name]: value });
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle>Add New Shop</CardTitle>
              <CardDescription>
                Enter the details of the new shop
              </CardDescription>
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
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="ownedBy">Owner</Label>
                    <Input
                      name="ownedBy"
                      id="ownedBy"
                      value={saveShop.ownedBy}
                      onChange={handleSaveChange}
                      placeholder="ID of the owner"
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute"></div>
        </div>
        <div className="relative h-screen flex items-center justify-center overflow-x-hidden"></div>
      </div>
    </div>
  );
}
