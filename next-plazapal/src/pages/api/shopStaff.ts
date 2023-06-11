import { db } from "@/lib/db";
import { log } from "console";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

// /api/shopStaff
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific shopStaff by ID
      const shopStaff = await db.shopStaff.findUnique({
        where: {
          ID: Number(id)
        },
        include: {
          Shop: {
            select: {
              Name: true,
            }
          }
        },
      });

      if (shopStaff) {
        res.status(200).json({
          name: shopStaff.Name,
          surname: shopStaff.Surname,
          email: shopStaff.Email,
          telephoneNo: shopStaff.TelephoneNo,
          worksAt: Number(shopStaff.WorksAt),
          employedFor: Number(shopStaff.EmployedFor),
          shopName: shopStaff.Shop.Name,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all shopStaffs
      const shopStaffs = await db.shopStaff.findMany({
        include: {
          Shop: {
            select: {
              Name: true,
            }
          }
        }
      });

      res.status(200).json(
        shopStaffs.map((shopStaff) => ({
          id: Number(shopStaff.ID),
          name: shopStaff.Name,
          surname: shopStaff.Surname,
          email: shopStaff.Email,
          telephoneNo: shopStaff.TelephoneNo,
          worksAt: Number(shopStaff.WorksAt),
          employedFor: Number(shopStaff.EmployedFor),
          shopName: shopStaff.Shop.Name,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { name, surname, email, telephoneNo, worksAt, employedFor, } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.shopStaff.update({
        where: {
          ID: Number(id),
        },
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          WorksAt: worksAt,
          EmployedFor: employedFor,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.shopStaff.create({
        data: {
          Name: name,
          Surname: surname,
          Email: email,
          TelephoneNo: telephoneNo,
          WorksAt: worksAt,
          EmployedFor: employedFor,
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
        const result = await db.shopStaff.delete({
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
