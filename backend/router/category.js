import express from "express";
import db from "../db.js";

const router = express.Router();


router.post("/Addcategory", (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  
  const checkSql = "SELECT * FROM category WHERE name = ?";
  db.query(checkSql, [category], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ error: "Category already Added" });
    }

  
    const insertSql = "INSERT INTO category (name) VALUES (?)";
    db.query(insertSql, [category], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Database error:", insertErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.status(200).json({
        message: "Category added successfully.",
        insertId: insertResult.insertId,
      });
    });
  });
});


router.get("/categories", (req, res) => {
  const sql = "SELECT * FROM category";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});



router.delete("/deleteCategory/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM category WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  });
});

router.put("/updateCategory/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const sql = "UPDATE category SET name = ? WHERE id = ?";
  db.query(sql, [name, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Category updated successfully" });
  });
});
//--------------------------------------------------------Item section---------------------------------------------- 
router.post("/AddItems", (req, res) => {
  const { Icode, Iname, Ibrand, Iquntity, Iprice, categories, packsize, discount, insertDate, expiredDate } = req.body;

  try {
    
    const checkSql = "SELECT * FROM stock WHERE code = ? OR name = ?";
    db.query(checkSql, [Icode, Iname], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error:", checkErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({ error: "This Item Already Added." });
      }

    
      const start = new Date(insertDate);
      const end = new Date(expiredDate);
      let days = null;
      if (!isNaN(start) && !isNaN(end)) {
        const diffTime = end - start; // milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        days = diffDays + " Days To Expired";
      }

    
      const insertSql =
        "INSERT INTO stock (code, name, brand, quantity, price, category, packsize, discount, insertdate, expiredate, days) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

      db.query(
        insertSql,
        [Icode, Iname, Ibrand, Iquntity, Iprice, categories, packsize, discount, insertDate, expiredDate, days],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Database error:", insertErr);
            return res.status(500).json({ error: "Internal server error" });
          }

          return res.status(200).json({
            message: "Item added successfully.",
            insertId: insertResult.insertId,
            daysUntilExpire: days,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/stock", (req, res) => {
  db.query("SELECT * FROM stock", (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

router.put("/updateItem/:id", (req, res) => {
  const id = req.params.id;
  
  const { code,name, brand, quantity, price, category, packsize, discount, insertdate, expiredate } = req.body;
  const start = new Date(insertdate);
  const end = new Date(expiredate);

    let days = null;
    if (!isNaN(start) && !isNaN(end)) {
    const diffTime = end - start; // milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    days = diffDays + " Days To Expired";
    }

  const sql = `UPDATE stock SET code=?, name=?, brand=?, quantity=?, price=?, category=?, packsize=?, discount=?, insertdate=?, expiredate=?, days=? WHERE Sid=?`;
  db.query(sql, [code ,name, brand, quantity, price, category, packsize, discount, insertdate, expiredate,days, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Item updated successfully" });
  });
});



router.delete("/deleteItem/:id", (req,res) => {
  const { id } = req.params;
  db.query("DELETE FROM stock WHERE Sid=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Item deleted successfully" });
  });
});

// GET categories
router.get("/category", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM categories");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


router.get("/search", (req, res) => {
  const searchQuery = req.query.q ;
  
  // Use LIKE to find items starting with searchQuery
  const sql = "SELECT * FROM stock WHERE name LIKE ? ORDER BY name ASC";
  const param = searchQuery + "%"; // starts with

  db.query(sql, [param], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});





export default router;