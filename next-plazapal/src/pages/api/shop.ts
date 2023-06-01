import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// POST /api/shop
// Required fields in body: sector, name, ownedBy
export default async function handle(req: any, res: any) {
  const { sector, name, ownedBy } = req.body;

  const result = await db.shop.create({
    data: {
      Sector: sector,
      Name: name,
      OwnedBy: ownedBy,
    },
  });

  // Use the replacer function when stringifying the result
  const resultString = JSON.stringify(result, replacer);

  res.json(JSON.parse(resultString));
}
