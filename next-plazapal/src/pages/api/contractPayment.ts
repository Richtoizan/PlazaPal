import { db } from "@/lib/db";

function replacer(key: any, value: any) {
  if (typeof value === "bigint") {
    // Convert all BigInt values to strings
    return value.toString();
  }
  return value;
}

// /api/contractPayment
export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const { contractId, paymentId } = req.query;

    if (contractId && paymentId) {
      // Handle GET request for a specific contractPayment by ID
      const contractPayment = await db.contractPayment.findUnique({
        where: {
          ContractID_PaymentID: {
            ContractID: Number(contractId),
            PaymentID: Number(paymentId),
          },
        },
      });

      if (contractPayment) {
        res.status(200).json({
          amountPaid: contractPayment.AmountPaid,
          timestamp: contractPayment.Timestamp,
          expectedDate: contractPayment.ExpectedDate,
        });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } else {
      // Handle GET request for all contractPayments
      const contractPayments = await db.contractPayment.findMany();

      res.status(200).json(
        contractPayments.map((contractPayment) => ({
          contractId: contractPayment.ContractID,
          paymentId: contractPayment.PaymentID,
          amountPaid: contractPayment.AmountPaid,
          timestamp: contractPayment.Timestamp,
          expectedDate: contractPayment.ExpectedDate,
        }))
      );
    }
  } else if (req.method === "POST") {
    const { newContractId, newPaymentId, amountPaid, timestamp, expectedDate } = req.body;
    const { contractId, paymentId } = req.query;

    if (contractId && paymentId) {
      const result = await db.contractPayment.update({
        where: {
          ContractID_PaymentID: {
            ContractID: Number(contractId),
            PaymentID: Number(paymentId),
          },
        },
        data: {
          AmountPaid: amountPaid,
          Timestamp: timestamp,
          ExpectedDate: expectedDate,
        },
      });

      const resultString = JSON.stringify(result, replacer);
      res.json(JSON.parse(resultString));
    } else {
      const result = await db.contractPayment.create({
        data: {
          ContractID: Number(newContractId),
          PaymentID: Number(newPaymentId),
          AmountPaid: amountPaid,
          Timestamp: timestamp,
          ExpectedDate: expectedDate,
        },
      });

      // Use the replacer function when stringifying the result
      const resultString = JSON.stringify(result, replacer);

      res.json(JSON.parse(resultString));
    }
  } else if (req.method === "DELETE") {
    const { contractId, paymentId } = req.query;
    if (contractId && paymentId) {
      try {
        const result = await db.contractPayment.delete({
          where: {
            ContractID_PaymentID: {
              ContractID: Number(contractId),
              PaymentID: Number(paymentId),
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
