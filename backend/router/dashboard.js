import express from "express";
import db from "../db.js";

const router = express.Router();



router.get("/getItem", (req, res) => {
   const { code } = req.query;
    const sql = `SELECT s.*, c.name AS category_name
    FROM stock s
    LEFT JOIN category c ON s.category = c.id
    WHERE s.code LIKE ?
  `;

  db.query(sql, [code+ "%"], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});



router.post("/addToCart", (req, res) => {
  const { code, quantity} = req.body;


  if (!code || !quantity ) {
    return res.status(400).json({ error: "Item, quantity, and mobile are required" });
  }
    
    
    const getStockSql = "SELECT * FROM stock WHERE code= ?";
    db.query(getStockSql, [code], (err, stockResult) => {
      if (err) {
        console.error("Stock lookup failed:", err);
        return res.status(500).json({ error: "Database error while fetching stock" });
      }

      if (stockResult.length === 0) {
        return res.status(404).json({ error: "Item not found in stock" });
      }

      const sid = stockResult[0].Sid;
      const availableStock = stockResult[0].quantity;
      const price = stockResult[0].price;


      if (quantity > availableStock) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      const Amount =  quantity * price;
      const newquntity = availableStock -quantity;
      const today = new Date();
     const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
        "-" +String(today.getDate()).padStart(2, "0");

        const checkSql = `SELECT * FROM bill WHERE Iid = ? AND date = ? AND action = "pending"`;
        db.query(checkSql, [sid, date], (err, result) => {
            if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
            }

            if (result.length > 0) {
            // Item already exists → update quantity & amount
            const existing = result[0];
            const newQuantity = existing.quantity + quantity;
            const newAmount = existing.Amount + Amount;

            const updateSql = `UPDATE bill SET quantity = ?, Amount = ? WHERE id = ?`;
            db.query(updateSql, [newQuantity, newAmount, existing.id], (err2) => {
                if (err2) {
                console.error("Update failed:", err2);
                return res.status(500).json({ error: "Database error" });
                }
                return res.status(200).json({ message: "bill updated successfully" });
            });

            } else {
            // Insert new row if not exists
            const insertSql = `INSERT INTO bill (Iid, quantity, Amount, date, action) VALUES (?, ?, ?, ?, "pending")`;
            db.query(insertSql, [sid, quantity, Amount, date], (err3, resultInsert) => {
                if (err3) {
                console.error("Insert failed:", err3);
                return res.status(500).json({ error: "Database error" });
                }
                return res.status(200).json({ 
                message: "Item added to bill",
                cartId: resultInsert.insertId 
                });
            });
            }
        });
       
        const stocksql = `UPDATE stock SET quantity=? WHERE Sid=?`;

        db.query(stocksql, [newquntity, sid ], (err, result) => {
            if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
            }

        });
   });
  });

    const today = new Date();
     const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
        "-" +String(today.getDate()).padStart(2, "0");
    router.get("/Getcartitem", (req, res) => {
    const sql = `
        SELECT 
        bill.id,
        bill.Billnum,
        bill.quantity, 
        bill.date, 
        stock.name, 
        stock.packsize AS size, 
        stock.price,
        (bill.quantity * stock.price) AS amount
        FROM bill 
        JOIN stock ON bill.Iid = stock.Sid 
        WHERE bill.action="pending" AND bill.date=?`;

    db.query(sql, [date], (err, result) => {
        if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
        }

        // Calculate total amount
        const totalAmount = result.reduce((sum, item) => sum + item.amount, 0);

        res.json({ items: result, totalAmount });
    });
});


router.delete("/deleteCartItem/:id", (req, res) => {
    const { id } = req.params;

    const billSql = "SELECT * FROM bill WHERE id = ?";
    db.query(billSql, [id], (err, billResult) => {
    if (err) {
        console.error("bill lookup failed:", err);
        return res.status(500).json({ error: "Database error while fetching bill" });
        }

        if (billResult.length === 0) {
        return res.status(404).json({ error: "bill not found" });
        }

        const Iid = billResult[0].Iid;
        const Bquantity = billResult[0].quantity;

        const stockSql1 = "SELECT * FROM stock WHERE Sid = ?";
        db.query(stockSql1, [Iid], (err, stockResult1) => {
        if (err) {
        console.error("bill lookup failed:", err);
        return res.status(500).json({ error: "Database error while fetching bill" });
        }

        if (stockResult1.length === 0) {
        return res.status(404).json({ error: "bill not found" });
        }

        const Squantity = stockResult1[0].quantity;

        const newquntity = Squantity+Bquantity;


        const stocksql = `UPDATE stock SET quantity=? WHERE Sid=?`;

        db.query(stocksql, [newquntity, Iid ], (err, result) => {
            if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
            }

        });


            const sql = "DELETE FROM bill WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ error: "Database error" });
                }
                

                res.json({ message: "Item deleted successfully" });
            });
        });
    });
});

router.post("/updateBillMobile", (req, res) => {
    const { mobile } = req.body;
   

    const getCustomerSql = "SELECT * FROM customer WHERE mobile = ?";
    db.query(getCustomerSql, [mobile], (err, customerResult) => {
    if (err) {
      console.error("Customer lookup failed:", err);
      return res.status(500).json({ error: "Database error while fetching customer" });
    }

    if (customerResult.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerId = customerResult[0].Cid;


        const getLastBillSql = "SELECT Billnum FROM bill ORDER BY id DESC LIMIT 1";
        db.query(getLastBillSql, (err, result) => {
            if (err) {
            console.error("Error fetching last bill:", err);
            return res.status(500).json({ error: "Database error" });
            }

            let newBillNo = "0001"; 

            if (result.length > 0 && result[0].Billnum) {
           
            const lastBillNo = parseInt(result[0].Billnum, 10);
            const nextBillNo = lastBillNo + 1;

            
            newBillNo = String(nextBillNo).padStart(4, "0");
            }

        const today = new Date();
        const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
        "-" +String(today.getDate()).padStart(2, "0");

            const stocksql = `UPDATE bill SET Billnum=?,Cid=? WHERE action=? AND date=?`;

                db.query(stocksql, [newBillNo, customerId,"pending",date ], (err, result) => {
                    if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                    }

                });

        });
});
});

router.post("/updateBillAction", (req, res) => {
  const { action} = req.body;
  const today = new Date();
  const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
        "-" +String(today.getDate()).padStart(2, "0");

  const sql = "UPDATE bill SET action = ? WHERE date = ? AND action = 'pending'";
  db.query(sql, [action, date], (err, result) => {
    if (err) {
      console.error("Update bill action failed:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.json({ message: "Bill action updated successfully" });
  });
});


export default router