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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default function Page() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    setSaveContract((prevState) => ({
      ...prevState,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    }));
  }, [startDate, endDate]);

  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  const [saveContract, setSaveContract] = useState({
    startDate: "",
    endDate: "",
    fee: "",
    paymentFrequency: "",
    spaceId: "",
    ownerId: "",
  });

  const router = useRouter();

  const [spaces, setSpaces] = useState([
    {
      id: "",
      location: "",
      floor: "",
      branchId: "",
      areaSquareMeter: "",
    },
  ]);

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

    const fetchSpaces = async () => {
      const endpoint = "/api/space";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setSpaces(result);
    };

    fetchOwners();
    fetchSpaces();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const dataToSend = {
       ...saveContract,
       startDate: startDate,
       endDate: endDate,
       fee: Number(saveContract.fee),
       ownerId: Number(saveContract.ownerId) ,
      };

    console.log("Data to send:", dataToSend);

    const endpoint = "/api/contractPayment";
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

    router.push("/contractPayment");
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveContract({ ...saveContract, [name]: value });
  };

  const handleSaveChangeSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSaveContract({ ...saveContract, [name]: value });
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
              Add Contract Payment
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Enter the details of the new contract</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dateOpened">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(selectedDate: Date | undefined) =>
                              selectedDate && setStartDate(selectedDate)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dateOpened">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(selectedDate: Date | undefined) =>
                              selectedDate && setEndDate(selectedDate)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="fee">Fee</Label>
                      <Input
                        name="fee"
                        id="fee"
                        value={saveContract.fee}
                        onChange={handleSaveChange}
                        placeholder="Fee of the contract"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                      <Input
                        name="paymentFrequency"
                        id="paymentFrequency"
                        value={saveContract.paymentFrequency}
                        onChange={handleSaveChange}
                        placeholder="Payment frequency of the contract"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 dark:text-white">
                      <Label htmlFor="space" id="space-select-label">
                        Space
                      </Label>
                      <Select
                        name="space"
                        labelId="space-select-label"
                        id="space-select"
                        value={saveContract.ownerId}
                        label="Space"
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
                        {spaces.map((space) => (
                          <MenuItem key={space.id} value={space.id}>
                            {space.id} {"("} {space.location}, {space.floor} in Branch No {space.branchId} {")"}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5 dark:text-white">
                      <Label htmlFor="ownedBy" id="ownedBy-select-label">
                        Owner
                      </Label>
                      <Select
                        name="ownedBy"
                        labelId="ownedBy-select-label"
                        id="ownedBy-select"
                        value={saveContract.ownerId}
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
              href="/contractPayment"
            >
              Back to contract payments
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
