import { db } from "@/lib/db";
import { log } from "console";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

// /api/mallStaff
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific mallStaff by ID
      const mallStaff = await db.mallStaff.findUnique({
        where: {
          ID: Number(id)
        },
      });

      if (mallStaff) {
        res.status(200).json({
          name: mallStaff.Name,
          surname: mallStaff.Surname,
          email: mallStaff.Email,
          telephoneNo: mallStaff.TelephoneNo,
          startDate: mallStaff.StartDate,
          salary: Number(mallStaff.Salary),
          assignedTo: Number(mallStaff.AssignedTo),
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all mallStaffs
      const mallStaffs = await db.mallStaff.findMany();

      res.status(200).json(
        mallStaffs.map((mallStaff) => ({
          id: Number(mallStaff.ID),
          name: mallStaff.Name,
          surname: mallStaff.Surname,
          email: mallStaff.Email,
          telephoneNo: mallStaff.TelephoneNo,
          startDate: mallStaff.StartDate,
          salary: Number(mallStaff.Salary),
          assignedTo: Number(mallStaff.AssignedTo),
        }))
      );
    }
  } else if (req.method === "POST") {
    const { name, surname, email, telephoneNo, startDate, salary, assignedTo } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.mallStaff.update({
        where: {
          ID: Number(id),
        },
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          StartDate: startDate,
          Salary: salary,
          AssignedTo: assignedTo,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.mallStaff.create({
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          StartDate: startDate,
          Salary: salary,
          AssignedTo: assignedTo,
        },
      });

      // Use the replacer function when stringifying the result
      const resultString = JSON.stringify(result, replacer);

      res.json(JSON.parse(resultString));
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (id) {
      try {
        const result = await db.mallStaff.delete({
          where: {
            ID: Number(id),
          },
        });

        const resultString = JSON.stringify(result, replacer);
        res.json(JSON.parse(resultString));
      } catch (error) {
        console.log(error); // this will print out the error in your server console
        res.status(405).json(error);
      }
    } else {
      res.status(405).json({ message: "Delete without ID Not Allowed" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
