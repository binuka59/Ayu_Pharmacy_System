import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/notifications", (req, res) => {

  const sql = `SELECT i.iname, s.quantity, s.expiredate, i.Iid AS itemId
    FROM stock s JOIN item i ON s.Iid = i.Iid
    WHERE (s.quantity = 0  OR s.expiredate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY))
    AND s.Sid = (
    SELECT MIN(Sid)  FROM stock  WHERE Iid = i.Iid )
    ORDER BY i.iname `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({message:"Error"});
    }

    res.json(result);

  });

});

router.get("/checknotifi/:id", (req, res) => {

  const { id } = req.params;
  console.log("hhhhh"+id);
  const sql = `
    SELECT 
      i.iname, 
      s.quantity, 
      s.expiredate, 
      i.packsize, 
      i.days, 
      i.brand,
      c.name AS categoryName
    FROM stock s 
    JOIN item i ON s.Iid = i.Iid
    JOIN category c ON i.category = c.id
    WHERE i.Iid = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error" });
    }

    res.json(result[0]);

  });

});

export default router;