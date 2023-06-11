import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/contract
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a specific contract by ID
      const contract = await db.contract.findUnique({
        where: {
          ID: Number(id),
        },
        include: {
          ShopOwner: {
            select: {
              Name: true,
              Surname: true,
            },
          },
        },
      });

      if (contract) {
        res.status(200).json({
          startDate: contract.StartDate,
          endDate: contract.EndDate,
          fee: contract.Fee,
          paymentFrequency: contract.PaymentFrequency,
          spaceId: Number(contract.SpaceID),
          ownerId: Number(contract.OwnerID),
          ownerName: contract.ShopOwner.Name + " " + contract.ShopOwner.Surname,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all contracts
      const contracts = await db.contract.findMany();

      res.status(200).json(
        contracts.map((contract) => ({
          id: Number(contract.ID),
          startDate: contract.StartDate,
          endDate: contract.EndDate,
          fee: contract.Fee,
          paymentFrequency: contract.PaymentFrequency,
          spaceId: Number(contract.SpaceID),
          ownerId: Number(contract.OwnerID),
        }))
      );
    }
  } else if (req.method === "POST") {
    const { startDate, endDate, fee, paymentFrequency, spaceId, ownerId } = req.body;
    const { id } = req.query;

    if (id) {
      const result = await db.contract.update({
        where: {
          ID: Number(id),
        },
        data: {
          StartDate: startDate,
          EndDate: endDate,
          Fee: fee,
          PaymentFrequency: paymentFrequency,
          SpaceID: Number(spaceId),
          OwnerID: Number(ownerId),
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.contract.create({
        data: {
          StartDate: startDate,
          EndDate: endDate,
          Fee: fee,
          PaymentFrequency: paymentFrequency,
          SpaceID: Number(spaceId),
          OwnerID: Number(ownerId),
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
        const result = await db.contract.delete({
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
