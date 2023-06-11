import LargeHeading from "@/components/ui/LargeHeading";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import params from "next/router";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const AdminPage = async ({ params }: { params: { admin: string } }) => {
  const admin = await db.admin.findUnique({
    where: {
      ID: Number(params.admin),
    },
  });

  if (!admin) return notFound();
  else {
    return (
      <div className="relative flex items-center justify-center overflow-x-hidden min-h-screen">
        <div className="container pt-24 max-w-9xl mx-auto w-full">
          <div className="gap-6 flex flex-col justify-center lg:justify-center items-center lg:items-start">
            <LargeHeading
              size="lg"
              className="three-d text-black dark:text-light-gold max-w-9xl"
            >
              <p>Admin ID: {Number(admin.ID)}</p>
              <p>Name: {admin.Name}</p>
              <p>Surname: {admin.Surname}</p>
              <p>Email: {admin.Email}</p>
              <p>Telephone Number: {admin.TelephoneNo}</p>
              <p>Is Mall Owner: {admin.isMallOwner ? "Yes" : "No"}</p>
            </LargeHeading>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/admin"
            >
              Back to admins
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default AdminPage;
