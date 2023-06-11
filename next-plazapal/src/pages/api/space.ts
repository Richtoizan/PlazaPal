import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/space
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific space by ID
      const space = await db.space.findUnique({
        where: {
          ID: Number(id),
        },
      });

      if (space) {
        res.status(200).json({
          location: space.Location,
          floor: space.Floor,
          branchId: Number(space.BranchID),
          areaSquareMeter: Number(space.AreaSquareMeter),
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all spaces
      const spaces = await db.space.findMany();

      res.status(200).json(
        spaces.map((space) => ({
          id: Number(space.ID),
          location: space.Location,
          floor: space.Floor,
          branchId: Number(space.BranchID),
          areaSquareMeter: Number(space.AreaSquareMeter),
        }))
      );
    }
  } else if (req.method === "POST") {
    const { location, floor, branchId, areaSquareMeter } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.space.update({
        where: {
          ID: Number(id),
        },
        data: {
          Location: location,
          Floor: floor,
          BranchID: Number(branchId),
          AreaSquareMeter: Number(areaSquareMeter),
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.space.create({
        data: {
          Location: location,
          Floor: floor,
          BranchID: Number(branchId),
          AreaSquareMeter: Number(areaSquareMeter),
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
        const result = await db.space.delete({
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
