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

  const {
    Icode,
    Iname,
    Ibrand,
    Iquntity,
    Iprice,
    categories,
    packsize,
    discount,
    insertDate,
    expiredDate
  } = req.body;

  try {

    // check duplicate (code + packsize + price)
    const checkSql = `
      SELECT i.Iid 
      FROM item i
      JOIN stock s ON i.Iid = s.Iid
      WHERE i.code = ? 
      AND i.packsize = ?
      AND s.price = ?
      LIMIT 1
    `;

    db.query(checkSql, [Icode, packsize, Iprice], (checkErr, checkResult) => {

      if (checkErr) {
        console.error(checkErr);
        return res.status(500).json({ error: "Database error" });
      }

      //duplicate items found
      if (checkResult.length > 0) {
        return res.status(400).json({
          error: "This "+ Iname+" " +packsize +" already Added.check and update"
        });
      }

      //  calculate expire days
      const today = new Date();
      const end = new Date(expiredDate);

      let days = null;

      if (!isNaN(today) && !isNaN(end)) {
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        days = diffDays + " Days To Expire";
      }

      //  generate batch
      const firstLetter = Iname.charAt(0).toUpperCase();

      const getBatchSql =
        "SELECT batch FROM stock WHERE batch LIKE ? ORDER BY batch DESC LIMIT 1";

      db.query(getBatchSql, [firstLetter + "%"], (batchErr, batchResult) => {

        if (batchErr) {
          console.error(batchErr);
          return res.status(500).json({ error: "Database error" });
        }

        let batch = firstLetter + "001";

        if (batchResult.length > 0) {
          const lastBatch = batchResult[0].batch;
          const number = parseInt(lastBatch.substring(1)) + 1;
          batch = firstLetter + number.toString().padStart(3, "0");
        }

        // insert item
        const insertItemSql = `
          INSERT INTO item 
          (code, iname, brand, packsize, category, insertdate, days) 
          VALUES (?,?,?,?,?,?,?)
        `;

        db.query(
          insertItemSql,
          [Icode, Iname, Ibrand, packsize, categories, insertDate, days],
          (insertErr, insertResult) => {

            if (insertErr) {
              console.error(insertErr);
              return res.status(500).json({ error: "Item insert error" });
            }

            const itemId = insertResult.insertId;

            //  insert stock
            const insertStockSql = `
              INSERT INTO stock 
              (Iid, quantity, price, discount, expiredate, batch) 
              VALUES (?,?,?,?,?,?)
            `;

            db.query(
              insertStockSql,
              [itemId, Iquntity, Iprice, discount, expiredDate, batch],
              (stockErr, stockResult) => {

                if (stockErr) {
                  console.error(stockErr);
                  return res.status(500).json({ error: "Stock insert error" });
                }

                return res.status(200).json({
                  message: "Item added successfully",
                  batch: batch,
                  itemId: itemId,
                  stockId: stockResult.insertId,
                  daysUntilExpire: days
                });

              }
            );

          }
        );

      });

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }

});


router.get("/stock", (req, res) => {
  const sql = `
 SELECT 
  i.Iid AS id,
  i.code,
  i.iname AS itemName,
  i.brand,
  i.packsize,
  i.insertdate,
  i.days,
  c.name AS caname,
  SUM(s.quantity) AS quantity,
  MAX(s.price) AS price,
  MAX(s.discount) AS discount,
  MAX(s.expiredate) AS expiredate,
  MAX(s.batch) AS batch
FROM item i
JOIN category c ON i.category = c.id
LEFT JOIN stock s ON s.Iid = i.Iid
GROUP BY i.Iid`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

router.put("/updateItem/:id/:batch", (req, res) => {

  const id = req.params.id;
  const batch = req.params.batch;
console.log(" batch is"+ batch);
console.log(" id is"+ id);
  const {
    code,
    name,
    brand,
    quantity,
    price,
    category,
    packsize,
    discount,
    insertdate,
    expiredate
  } = req.body;

  const today = new Date();
  const end = new Date(expiredate);

  let days = null;

  if (!isNaN(today) && !isNaN(end)) {
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    days = diffDays + " Days To Expired";
  }

  // update item table
  const sqlItem = `UPDATE item SET code=?, iname=?, brand=?, packsize=?, category=?, insertdate=?, days=? WHERE Iid=? `;

  db.query(
    sqlItem,[code, name, brand, packsize, category, insertdate, days, id],
    (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Item update failed" });
      }

      // update stock table
      const sqlStock = `UPDATE stock SET  quantity=?, price=?, discount=?, expiredate=?  WHERE Iid=? AND batch = ?`;

      db.query(
        sqlStock, [ quantity, price, discount, expiredate, id, batch],
        (err2, result2) => {

          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Stock update failed" });
          }

          res.json({
            message: "Item and Stock updated successfully"
          });

        }
      );

    }
  );

});


router.delete("/deleteItem/:id", (req, res) => {

  const { id } = req.params;

  // first delete stock
  const deleteStockSql = "DELETE FROM stock WHERE Iid=?";

  db.query(deleteStockSql, [id], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Stock delete failed" });
    }

    // then delete item
    const deleteItemSql = "DELETE FROM item WHERE Iid=?";

    db.query(deleteItemSql, [id], (err2, result2) => {

      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Item delete failed" });
      }

      res.json({
        message: "Item  deleted successfully"
      });

    });

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
  const searchQuery = req.query.q;

  // 🔥 prevent empty search
  if (!searchQuery || searchQuery.trim() === "") {
    return res.json([]);
  }

  const sql = `
    SELECT 
      i.Iid,
      i.code,
      i.iname,
      i.brand,
      i.packsize,
      i.insertdate,
      i.days,
      c.name AS category,
      SUM(s.quantity) AS quantity,
      MAX(s.price) AS price,
      MAX(s.discount) AS discount,
      MAX(s.expiredate) AS expiredate
    FROM item i
    JOIN category c ON i.category = c.id
    LEFT JOIN stock s ON s.Iid = i.Iid
    WHERE i.iname LIKE ?
    GROUP BY i.Iid
    ORDER BY i.iname ASC
  `;

  const param = searchQuery + "%";

  db.query(sql, [param], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(result);
  });
});





export default router;