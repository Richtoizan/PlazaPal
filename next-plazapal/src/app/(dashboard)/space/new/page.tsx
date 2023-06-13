"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { ChangeEvent } from "react";
import LargeHeading from "@/components/ui/LargeHeading";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Console } from "console";

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

  const [saveSpace, setSaveSpace] = useState({
    location: "",
    floor: "",
    branchID: "",
    areaSquareMeter: "",
  });

  const router = useRouter();

  const [branches, setBranches] = useState([
    {
      id: "",
      location: "",
    },
  ]);

  const [selectedBranchLocation, setSelectedBranchLocation] = useState("");
  const [branchID, setBranchID] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      // Fetch branches from API
      const endpoint = "/api/branch";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      const branchesWithUniqueIds = result.map((branch: any, index: any) => ({
        ...branch,
        id: String(index),
      }));

      setBranches(branchesWithUniqueIds);
    };

    fetchBranches();
    console.log(branches);
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log("Branch ID:", Number(branchID));

    const dataToSend = { ...saveSpace, branchID: Number(branchID) };

    const endpoint = "/api/space";
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
      router.push("/space");
    }
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveSpace({ ...saveSpace, [name]: value });
  };

  const handleSaveChangeSelect = (event: SelectChangeEvent) => {
    const { value } = event.target;

    // Find the branch that has the selected location
    const selectedBranch = branches.find((branch) => branch.location === value);

    console.log("Selected branch location:", value);
    console.log("Selected branch:", selectedBranch);

    // If a branch was found, use its ID. If not, default to an empty string.
    const selectedBranchID = selectedBranch ? selectedBranch.id : "";

    setSelectedBranchLocation(value);
    setBranchID(selectedBranchID);
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
              Add Space
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Enter the details of the new space</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        name="location"
                        id="location"
                        value={saveSpace.location}
                        onChange={handleSaveChange}
                        placeholder="Location of the space"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        name="floor"
                        id="floor"
                        value={saveSpace.floor}
                        onChange={handleSaveChange}
                        placeholder="Floor of the space"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="areaSquareMeter">
                        Area in Square Meters
                      </Label>
                      <Input
                        name="areaSquareMeter"
                        id="areaSquareMeter"
                        value={saveSpace.areaSquareMeter}
                        onChange={handleSaveChange}
                        placeholder="Area of the space in square meters"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 dark:text-white">
                      <Label htmlFor="branchID" id="branchID-select-label">
                        Branch
                      </Label>
                      <Select
                        name="branchID"
                        labelId="branchID-select-label"
                        id="branchID-select"
                        label="Branch"
                        value={selectedBranchLocation}
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
                        {branches.map((branch, index) => (
                          <MenuItem key={index} value={branch.location}>
                            {branch.location}
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
              href="/space"
            >
              Back to spaces
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
