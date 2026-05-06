import express from "express";
import db from "../db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
// ------------printer------------------------------------

import { printer as ThermalPrinter, types as PrinterTypes } from "node-thermal-printer";

const app = express();
app.use(express.json());
// ------------------------------------------------------------


router.get("/getItem",(req, res) => {

  const { code } = req.query;

  const sql = `
    SELECT  
      i.Iid, 
      i.code, 
      i.iname, 
      i.brand, 
      i.packsize,
      c.name AS category_name,

      CASE 
        WHEN i.days = 'Expired' THEN 'Expired'
        WHEN s.quantity = 0 THEN 'Out of Stock'
        ELSE s.quantity
      END AS stock_status,

      s.price

    FROM stock s
    JOIN item i ON i.Iid = s.Iid
    LEFT JOIN category c ON i.category = c.id
    WHERE i.code LIKE ?
    ORDER BY s.expiredate ASC
    LIMIT 1
  `;

  db.query(sql, [code + "%"], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
  });

});





router.post("/addToCart",verifyToken, (req, res) => {
  const { code, quantity} = req.body;

  if (!code || !quantity) {
    return res.status(400).json({ error: "Item and quantity are required" });
  }
  
  const userId = req.user.id; // Login user id (StId)
  // console.log("User:", userId);
    
  const getStockSql = `
    SELECT s.*, i.*
    FROM stock s
    JOIN item i ON s.Iid = i.Iid
    WHERE i.code = ?
      AND s.quantity > 0
    ORDER BY s.expiredate ASC
    LIMIT 1
  `;

  db.query(getStockSql, [code], (err, stockResult) => {
    if (err) return res.status(500).json({ error: "Database error while fetching stock" });
    if (stockResult.length === 0) return res.status(404).json({ error: "Item not found in stock" });

    const sid = stockResult[0].Sid;
    const availableStock = stockResult[0].quantity;
    const price = stockResult[0].price;
    const batch = stockResult[0].batch;

    if (quantity > availableStock) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    const Amount = quantity * price;
    const newQuantityStock = availableStock - quantity;

    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // Check if same item already exists in bill for today
    const checkSql = `SELECT * FROM bill WHERE Iid = ? AND StId = ? AND date = ? AND action = "pending"`;
    
    db.query(checkSql, [sid, userId, date], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.length > 0) {
        // Update existing bill
        const existing = result[0];
        const newQuantity = existing.quantity + quantity;
        const newAmount = existing.Amount + Amount;

        const updateSql = `UPDATE bill SET quantity = ?, Amount = ? WHERE id = ? AND StId = ?`;
        db.query(updateSql, [newQuantity, newAmount, existing.id, userId], (err2) => {
          if (err2) return res.status(500).json({ error: "Database error" });
          return res.status(200).json({ message: "Bill updated successfully" });
        });

      } else {
        // Insert new bill
        const insertSql = `INSERT INTO bill (Iid, quantity, StId, Amount, date, action) VALUES (?, ?, ?, ?, ?, "pending")`;
        // console.log("id sis"+ userId)

        db.query(insertSql, [sid, quantity,userId ,Amount, date], (err3, resultInsert) => {
          if (err3) return res.status(500).json({ error: "Database error" });
          return res.status(200).json({
            message: "Item added to bill",
            cartId: resultInsert.insertId
          });
        });
      }

      // Update stock quantity
      const stockSql = `UPDATE stock SET quantity = ? WHERE batch = ?`;
      db.query(stockSql, [newQuantityStock, batch], (err) => {
        if (err) console.error("Stock update failed:", err);
      });
    });
  });
});

    const today = new Date();
     const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
        "-" +String(today.getDate()).padStart(2, "0");
router.get("/Getcartitem", verifyToken,(req, res) => {

      const userId = req.user.id;
       
      const sql = `
      SELECT 
        bill.id,
        bill.Billnum,
        bill.quantity, 
        bill.date, 
        item.iname, 
        item.packsize AS size, 
        s.price,
        (bill.quantity * s.price) AS amount
      FROM bill
      JOIN stock s ON bill.Iid = s.Sid
      JOIN item ON s.Iid = item.Iid
      WHERE bill.action = 'pending'
      AND bill.date = ? AND StId = ?
      `;

    db.query(sql, [date, userId], (err, result) => {
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

  // Get item details from multiple tables
  const itemSql =`
    SELECT 
      item.code,
      item.iname AS item_name,
      item.brand,
      item.packsize,
      category.name AS category,
      stock.quantity,
      stock.price,
      bill.quantity AS bill_qty,
      stock.Sid
    FROM bill
    JOIN stock ON bill.Iid = stock.Sid
    JOIN item ON stock.Iid = item.Iid
    JOIN category ON item.category = category.id
    WHERE bill.id = ?
  `;

  db.query(itemSql, [id], (err, result) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const item = result[0];

    const restoreQty = item.quantity + item.bill_qty;

    // restore stock quantity
    const updateStock = "UPDATE stock SET quantity=? WHERE Sid=?";
    db.query(updateStock, [restoreQty, item.Sid], (err) => {
      if (err) {
        console.error("Stock update error:", err);
        return res.status(500).json({ error: "Stock update failed" });
      }

      // delete from cart (bill table)
      const deleteSql = "DELETE FROM bill WHERE id=?";
      db.query(deleteSql, [id], (err) => {
        if (err) {
          console.error("Delete error:", err);
          return res.status(500).json({ error: "Delete failed" });
        }

        // send item details to frontend
        res.json({
          message: "Item deleted successfully",
          item: {
            code: item.code,
            iname: item.item_name,
            brand: item.brand,
            packsize: item.packsize,
            category_name: item.category,
            stock_status: restoreQty,
            price: item.price
          }
        });
      });
    });
  });
});

router.post("/updateBillMobile",verifyToken, (req, res) => 
{
  const { mobile } = req.body;
  const userId = req.user.id;
  
  const today = new Date();
  const date =today.getFullYear() +"-" +String(today.getMonth() + 1).padStart(2, "0") +
    "-" +String(today.getDate()).padStart(2, "0");

  const getCustomerSql = "SELECT * FROM customer WHERE mobile = ?";
  db.query(getCustomerSql, [mobile], (err, customerResult) => 
  {
    if (err) 
    {
      console.error("Customer lookup failed:", err);
      return res.status(500).json({ error: "Database error while fetching customer" });
    }
    

    if (customerResult.length === 0) 
    {
      return res.status(404).json({ error: "Customer not found" });
    }
    const customerId = customerResult[0].Cid;
    const checkPendingSql =`SELECT Billnum FROM bill WHERE Cid = ? AND StId =? AND action = "pending" AND date =? LIMIT 1`;

    db.query(checkPendingSql, [customerId ,userId, date], (err, result) => 
    {
      let newBillNo; 
      if (err) 
      {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      } 
      if (result.length > 0) 
      {
        
        newBillNo = result[0].Billnum;
        // console.log("bills number hri "+newBillNo);
        const stocksql = `UPDATE bill SET Billnum=?, StId =? ,Cid=? WHERE action=? AND date=?`;
            db.query(stocksql, [newBillNo, userId, customerId,"pending",date ], (err, result) =>
            {
              if (err) 
              {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal server error" });
              }
              return res.json({ Billnum: newBillNo });
            });
      }  

      else 
      { // pending na → last successful bill eka ganna
        const getLastBillSql =`SELECT Billnum FROM bill WHERE action = "successfull"  ORDER BY id DESC  LIMIT 1 `;

        db.query(getLastBillSql, (err, result) => 
        {
          if (err) 
          {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }

          let nextBillNo = 1;

          if (result.length > 0 && result[0].Billnum) 
          {
            const lastBillNo = parseInt(result[0].Billnum, 10);
            nextBillNo = lastBillNo + 1;
            
          }

          newBillNo = String(nextBillNo).padStart(4, "0");
          
          const stocksql = `UPDATE bill SET Billnum=?,StId =?,Cid=? WHERE action=? AND date=?`;
            db.query(stocksql, [newBillNo,userId, customerId,"pending",date ], (err, result) =>
            {
              if (err) 
              {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal server error" });
              }
              return res.json({ Billnum: newBillNo });
            });

        });
      }
    });
  });
});

// router.post("/print-bill", async (req, res) => {

  // const { billNo, totalAmount, cartitems, cash, balance } = req.body;

  // try {

  //   let printer = new ThermalPrinter({
  //     type: PrinterTypes.EPSON,
  //     interface: 'printer:LBP6030/6040/6018L'
  //   });

  //   printer.println("Ayu Pharmacy");
  //   printer.println("Colombo Road, Pothuhera");
  //   printer.println("037-3456789 / 0774567890");
  //   printer.println(`Bill No: ${billNo}`);
  //   printer.println(`Date: ${new Date().toLocaleString()}`);
  //   printer.println("Name          Size  Qty  Price  Amount");
  //   printer.println("----------------------------------------");

  //   cartitems.forEach(item => {

  //     const name = item.iname.padEnd(12, ' ');
  //     const size = item.size.toString().padEnd(5, ' ');
  //     const qty = item.quantity.toString().padEnd(4, ' ');
  //     const price = item.price.toFixed(2).padEnd(6, ' ');
  //     const amount = item.amount.toFixed(2).padEnd(6, ' ');

  //     printer.println(`${name}${size}${qty}${price}${amount}`);

  //   });

  //   printer.println("----------------------------------------");
  //   printer.println(`Total: ${totalAmount.toFixed(2)}`);
  //   printer.println(`Cash: ${cash.toFixed(2)}`);
  //   printer.println(`Balance: ${balance.toFixed(2)}`);
  //   printer.println("----------------------------------------");
  //   printer.println("Thank you, come again!");
  //   printer.cut();

  //   await printer.execute();

    // ---------- Update bill ----------
//     const today = new Date();
//     const date =
//       today.getFullYear() +
//       "-" +
//       String(today.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(today.getDate()).padStart(2, "0");

//     const sql = "UPDATE bill SET action = ? WHERE date = ? AND action = 'pending'";

//     db.query(sql, ["successfull", date], (err) => {

//       if (err) {
//         console.error("Update bill action failed:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       res.json({
//         message: "Bill printed and updated successfully"
//       });

//     });

//   } catch (err) {

//     console.error("Print error:", err);
//     res.status(500).json({ error: "Printing failed" });

//   }

// });
// ----------------------laser printer-------------------------

router.post("/updateBillAction", async (req, res) => {
  try {
  const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    const sql = "UPDATE bill SET action = ? WHERE date = ? AND action = 'pending'";

    db.query(sql, ["successfull", date], (err) => {

      if (err) {
        console.error("Update bill action failed:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "Bill printed and updated successfully"
      });

    });

  } catch (err) {

    console.error("Print error:", err);
    res.status(500).json({ error: "Printing failed" });

  }

});




export default router