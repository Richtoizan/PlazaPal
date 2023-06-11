import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/sensorData
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { sensorId, timestamp } = req.query;

    if (sensorId && timestamp) {
      // Handle GET request for a specific sensorData by ID
      const sensorData = await db.sensorData.findUnique({
        where: {
          SensorID_Timestamp: {
            SensorID: Number(sensorId),
            Timestamp: timestamp,
          },
        },
      });

      if (sensorData) {
        res.status(200).json({
          detectionCount: sensorData.DetectionCount,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all sensorsData
      const sensorsData = await db.sensorData.findMany();

      res.status(200).json(
        sensorsData.map((sensorData) => ({
          sensorId: sensorData.SensorID,
          timestamp: sensorData.Timestamp,
          detectionCount: sensorData.DetectionCount,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { newSensorId, newTimestamp, detectionCount } = req.body;
    const { sensorId, timestamp } = req.query;

    if (sensorId && timestamp) {
      const result = await db.sensorData.update({
        where: {
          SensorID_Timestamp: {
            SensorID: Number(sensorId),
            Timestamp: timestamp,
          },
        },
        data: {
          DetectionCount: detectionCount,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.sensorData.create({
        data: {
          SensorID: Number(newSensorId),
          Timestamp: newTimestamp,
          DetectionCount: detectionCount,
        },
      });

      // Use the replacer function when stringifying the result
      const resultString = JSON.stringify(result, replacer);

      res.json(JSON.parse(resultString));
    }
  } else if (req.method === "DELETE") {
    const { sensorId, timestamp } = req.query;
    if (sensorId && timestamp) {
      try {
        const result = await db.sensorData.delete({
          where: {
            SensorID_Timestamp: {
              SensorID: Number(sensorId),
              Timestamp: timestamp,
            },
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
