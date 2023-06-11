import { db } from "@/lib/db";
import { log } from "console";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

// /api/shopOwner
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific shopOwner by ID
      const shopOwner = await db.shopOwner.findUnique({
        where: { ID: Number(id) },
      });

      if (shopOwner) {
        res.status(200).json({
          name: shopOwner.Name,
          surname: shopOwner.Surname,
          email: shopOwner.Email,
          telephoneNo: shopOwner.TelephoneNo,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all shopOwners
      const shopOwners = await db.shopOwner.findMany();

      res.status(200).json(
        shopOwners.map((shopOwner) => ({
          id: Number(shopOwner.ID),
          name: shopOwner.Name,
          surname: shopOwner.Surname,
          email: shopOwner.Email,
          telephoneNo: shopOwner.TelephoneNo,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { name, surname, email, telephoneNo, } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.shopOwner.update({
        where: {
          ID: Number(id),
        },
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.shopOwner.create({
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
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
        const result = await db.shopOwner.delete({
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
