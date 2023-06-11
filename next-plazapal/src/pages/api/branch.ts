import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/branch
// Required fields in body: sector, name, ownedBy
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific branch by ID
      const branch = await db.branch.findUnique({
        where: {
          ID: Number(id),
        },
        include: {
          Admin: {
            select: {
              Name: true,
              Surname: true,
            },
          },
        },
      });

      if (branch) {
        res.status(200).json({
          location: branch.Location,
          dateOpened: branch.DateOpened,
          managedBy: Number(branch.ManagedBy),
          managerName: branch.Admin.Name + " " + branch.Admin.Surname,
        });
      } else {
        res.status(404).json({ message: "Branch not found" });
      }
    } else {
      // Handle GET request for all branches
      const branches = await db.branch.findMany();

      res.status(200).json(
        branches.map((branch) => ({
          location: branch.Location,
          dateOpened: branch.DateOpened,
          managedBy: Number(branch.ManagedBy),
        }))
      );
    }
  } else if (req.method === "POST") {
    const { location, dateOpened, managedBy } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.branch.update({
        where: {
          ID: Number(id),
        },
        data: {
          Location: location,
          DateOpened: dateOpened,
          ManagedBy: managedBy,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.branch.create({
        data: {
          Location: location,
          DateOpened: dateOpened,
          ManagedBy: managedBy,
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
        const result = await db.branch.delete({
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
