import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/shop
// Required fields in body: sector, name, ownedBy
export default async function handle(req: any, res: any) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific shop by ID
      const shop = await db.shop.findUnique({
        where: {
          ID: Number(id),
        },
        include: {
          ShopOwner: {
            select: {
              Name: true,
              Surname: true,
            }
          }
        }
      });

      if (shop) {
        res.status(200).json({
          name: shop.Name,
          sector: shop.Sector,
          ownedBy: Number(shop.OwnedBy),
          ownerName: shop.ShopOwner.Name + " " + shop.ShopOwner.Surname
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      // Handle GET request for all shops
      const shops = await db.shop.findMany();

      res.status(200).json(shops.map(shop => ({
          name: shop.Name,
          sector: shop.Sector,
          ownedBy: Number(shop.OwnedBy),
        })));
    }
  }
  else if (req.method === 'POST') {
    const { sector, name, ownedBy } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.shop.update({
        where: {
          ID: Number(id),
        },
        data: {
          Sector: sector,
          Name: name,
          OwnedBy: ownedBy,
        }
      })

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    }
    else {

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
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
