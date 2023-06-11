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
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    setSaveBranch((prevState) => ({
      ...prevState,
      dateOpened: format(date, "yyyy-MM-dd"),
    }));
  }, [date]);

  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  const [saveBranch, setSaveBranch] = useState({
    location: "",
    dateOpened: "",
    managedBy: "",
  });

  const router = useRouter();

  const [managers, setManagers] = useState([
    {
      id: "",
      name: "",
      surname: "",
    },
  ]);

  useEffect(() => {
    const fetchManagers = async () => {
      const endpoint = "/api/admin";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();

      setManagers(result);
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // updating dateOpened field with date object
    const dataToSend = {
      ...saveBranch,
      dateOpened: date,
      ownedBy: Number(saveBranch.managedBy),
    };

    console.log("Data to send:", dataToSend);

    const endpoint = "/api/branch";
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

    router.push("/branch");
  };

  const handleSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaveBranch({ ...saveBranch, [name]: value });
  };

  const handleSaveChangeSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setSaveBranch({ ...saveBranch, [name]: value });
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
              Add Branch
            </LargeHeading>
            <Card className="border-black dark:border-white">
              <CardHeader>
                <CardTitle>Enter the details of the new branch</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        name="location"
                        id="location"
                        value={saveBranch.location}
                        onChange={handleSaveChange}
                        placeholder="Location of the branch"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dateOpened">Date Opened</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate: Date | undefined) =>
                              selectedDate && setDate(selectedDate)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col space-y-1.5 dark:text-white">
                      <Label htmlFor="managedBy" id="managedBy-select-label">
                        Manager
                      </Label>
                      <Select
                        name="managedBy"
                        labelId="managedBy-select-label"
                        id="managedBy-select"
                        value={saveBranch.managedBy}
                        label="Manager"
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
                        {managers.map((manager) => (
                          <MenuItem key={manager.id} value={manager.id}>
                            {manager.name} {manager.surname}
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
              href="/branch"
            >
              Back to branches
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
