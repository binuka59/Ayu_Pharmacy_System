import express from "express";
import db from "../db.js";

const router = express.Router();



router.get("/Getcartitem", (req, res) => {
  const today = new Date();
  const date = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") +
    "-" + String(today.getDate()).padStart(2, "0");

  const sql = `
    SELECT bill.id, bill.Billnum, bill.quantity, bill.Amount, customer.name AS customerName
    FROM bill
    LEFT JOIN customer ON bill.Cid = customer.Cid
    WHERE bill.action = "successfull" AND bill.date = ?`;

  db.query(sql, [date], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const aggregated = {};
    result.forEach(item => {
      const billNo = item.Billnum;

      if (!aggregated[billNo]) {
        aggregated[billNo] = {
          Billnum: billNo,
          customerName: item.customerName || "Unknown",
          totalBILLQuantity: 0,
          totalAmount: 0
        };
      }

      aggregated[billNo].totalBILLQuantity += item.quantity;
      aggregated[billNo].totalAmount += item.Amount;
    });

    const aggregatedArray = Object.values(aggregated);
    res.json({ items: aggregatedArray });
  });
});

router.get("/GetBillDetails/:billnum", (req, res) => {
  const { Billnum } = req.params;

  const sql = `
    SELECT bill.Billnum, bill.quantity, bill.Amount,
           customer.name AS customerName, stock.name AS stname
    FROM bill
    LEFT JOIN customer ON bill.Cid = customer.Cid
    LEFT JOIN stock ON bill.Sid = stock.Sid
    WHERE bill.Billnum = ? AND bill.action = "successfull"`;

  db.query(sql, [Billnum], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) return res.json({});

    const summary = {
      Billnum: result[0].Billnum,
      customerName: result[0].customerName || "Unknown",
      totalQuantity: result.reduce((sum, r) => sum + r.quantity, 0),
      totalAmount: result.reduce((sum, r) => sum + r.Amount, 0),
      items: result.map(r => ({
        stname: r.stname,
        quantity: r.quantity,
        amount: r.Amount
      }))
    };

    res.json(summary);
  });
});



export default router;
