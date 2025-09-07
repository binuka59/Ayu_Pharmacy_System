import express from "express";
import db from "../db.js";

const router = express.Router();
router.post("/AddCustomer", (req, res) => {
  const { name, address, age, mobile, email, gender } = req.body;

  if (!name || !address || !age || !mobile ||  !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if customer already exists (by mobile or email)
  const checkSql = "SELECT * FROM customer WHERE mobile = ? OR email = ?";
  db.query(checkSql, [mobile, email], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ error: "Customer Already Added" });
    }

    // Insert customer
    const sql =
      "INSERT INTO customer (name, address, age, mobile, email, gender) VALUES (?,?,?,?,?,?)";
    db.query(sql, [name, address, age, mobile, email, gender], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(200).json({
        message: "Customer added successfully",
        insertId: result.insertId,
      });
    });
  });
});

// Fetch all customers
router.get("/GetCustomers", (req, res) => {
  const sql = "SELECT * FROM customer";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});

// DELETE customer by id
router.delete("/deleteCustomer/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM customer WHERE Cid = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deleted successfully" });
  });
});

router.put("/updateCustomer/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, age, mobile, email, gender } = req.body;

  const sql = `UPDATE customer SET name=?, address=?, age=?, mobile=?, email=?, gender=? WHERE Cid=?`;

  db.query(sql, [name, address, age, mobile, email, gender, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer updated successfully" });
  });
});

// Search customers by mobile number
router.get("/searchCustomer", (req, res) => {
  const { mobile } = req.query;

  if (!mobile) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  const sql = "SELECT * FROM customer WHERE mobile LIKE ?";
  db.query(sql, [mobile + "%"], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});



export default router;