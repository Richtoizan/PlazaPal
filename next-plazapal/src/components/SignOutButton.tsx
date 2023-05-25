"use client";

import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { toast } from "./ui/Toast";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

interface SignOutButtonProps {}

const SignOutButton: FC<SignOutButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signUserOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        callbackUrl: `${"/"}`,
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        message: "Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <Link href={"/"}>
      <Button onClick={signUserOut} isLoading={isLoading}>
        Sign out
      </Button>
    </Link>
  );
};

export default SignOutButton;
