import { db } from "@/lib/db";
import { log } from "console";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/shopOwner
// Required fields in body: id, name, surname
export default async function handle(req: any, res: any) {
  if (req.method === 'GET') {
    const owners = await db.shopOwner.findMany();

    res.status(200).json(owners.map(owner => ({
      id: Number(owner.ID),
      name: owner.Name,
      surname: owner.Surname,
    })));
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
