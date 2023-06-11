import { db } from "@/lib/db";
import { log } from "console";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

// /api/admin
// Required fields in body: id, name, surname, email, telephoneNo, isMallOwner, password
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific admin by ID
      const admin = await db.admin.findUnique({
        where: { ID: Number(id) },
      });

      if (admin) {
        res.status(200).json({
          name: admin.Name,
          surname: admin.Surname,
          email: admin.Email,
          telephoneNo: admin.TelephoneNo,
          isMallOwner: admin.isMallOwner,
          password: admin.Password,
        });
      } else {
        res.status(404).json({ message: "Admin not found" });
      }
    } else {
      // Handle GET request for all admins
      const admins = await db.admin.findMany();

      res.status(200).json(
        admins.map((admin) => ({
          name: admin.Name,
          surname: admin.Surname,
          email: admin.Email,
          telephoneNo: admin.TelephoneNo,
          isMallOwner: admin.isMallOwner,
          password: admin.Password,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { name, surname, email, telephoneNo, isMallOwner, password } =
      req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.admin.update({
        where: {
          ID: Number(id),
        },
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          isMallOwner: isMallOwner,
          Password: password,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.admin.create({
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          isMallOwner: isMallOwner,
          Password: password,
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
        const result = await db.admin.delete({
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
