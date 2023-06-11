import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/occupiedSpace
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific occupiedSpace by ID
      const occupiedSpace = await db.occupiedSpace.findUnique({
        where: {
          SpaceID: Number(id),
        },
      });

      if (occupiedSpace) {
        res.status(200).json({
          dateOpened: occupiedSpace.DateOpened,
          openTime: occupiedSpace.OpenTime,
          closeTime: occupiedSpace.CloseTime,
          shopId: Number(occupiedSpace.ShopID),
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all occupiedSpaces
      const occupiedSpaces = await db.occupiedSpace.findMany();

      res.status(200).json(
        occupiedSpaces.map((occupiedSpace) => ({
          spaceId: Number(occupiedSpace.SpaceID),
          dateOpened: occupiedSpace.DateOpened,
          openTime: occupiedSpace.OpenTime,
          closeTime: occupiedSpace.CloseTime,
          shopId: Number(occupiedSpace.ShopID),
        }))
      );
    }
  } else if (req.method === "POST") {
    const { spaceId, dateOpened, openTime, closeTime, shopId } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.occupiedSpace.update({
        where: {
          SpaceID: Number(id),
        },
        data: {
          DateOpened: dateOpened,
          OpenTime: openTime,
          CloseTime: closeTime,
          ShopID: Number(shopId),
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.occupiedSpace.create({
        data: {
          SpaceID: spaceId,
          DateOpened: dateOpened,
          OpenTime: openTime,
          CloseTime: closeTime,
          ShopID: Number(shopId),
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
        const result = await db.occupiedSpace.delete({
          where: {
            SpaceID: Number(id),
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
