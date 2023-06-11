import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/sensor
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific sensor by ID
      const sensor = await db.sensor.findUnique({
        where: {
          ID: Number(id),
        },
      });

      if (sensor) {
        res.status(200).json({
          spaceId: sensor.SpaceID,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all sensors
      const sensors = await db.sensor.findMany();

      res.status(200).json(
        sensors.map((sensor) => ({
          id: sensor.ID,
          spaceId: sensor.SpaceID,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { spaceId } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.sensor.update({
        where: {
          ID: Number(id),
        },
        data: {
          SpaceID: spaceId,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.sensor.create({
        data: {
          SpaceID: spaceId,
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
        const result = await db.sensor.delete({
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
