import express from "express";
import db from "../db.js"; 
const router = express.Router();
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


router.get("/getsuppliers", (req, res) => {
  const sql = `
    SELECT u.id, u.name, u.email, u.mobile, s.brand
    FROM user u
    INNER JOIN supplier s ON u.id = s.supid
    WHERE u.action = 'supplier'
    ORDER BY u.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});




router.post("/addsupplier", async (req, res) => {
  try {
    const { name, email, mobile, brand, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !brand || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match. Try again" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const userSql = "INSERT INTO user (name, email, mobile, password, action) VALUES (?, ?, ?, ?, ?)";
    db.query(userSql, [name, email, mobile, hashedPassword, "supplier"], (err, result) => {
      if (err) {
        console.error("Insert into user failed:", err);
        return res.status(500).json({ error: "Insert failed" });
      }

      const userId = result.insertId; 

      
      const supplierSql = "INSERT INTO supplier (supid, brand) VALUES (?,  ?)";
      db.query(supplierSql, [userId,  brand], (err2) => {
        if (err2) {
          console.error("Insert into supplier table failed:", err2);
          return res.status(500).json({ error: "Supplier insert failed" });
        }

      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ayupharmacys@gmail.com",
          pass: "pvtr brmn nwtb sivm", // Gmail app password
        },
      });

      const mailOptions = {
        from: "ayupharmacys@gmail.com",
        to: email,
        subject: "Welcome to Ayu Pharmacy",
        text: `This is your Ayu Pharmacy login details.Don't Share with Others...

        Email Address:${email}
        Password :${password}

        Best regards,
        Ayu Pharmacy 
        Colombo Road, Pothuhera.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
           
            return res.status(200).json({
              message: "Supplier added, but email failed to send",
              id: userId,
              name,
              email,
              mobile,
              brand,
            });
          }

          console.log("Email sent:", info.response);

         
          res.status(200).json({
            message: "Supplier added successfully & email sent",
            id: userId,
            name,
            email,
            mobile,
            brand,
          });
        });
      });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/deletesupplier/:id", (req, res) => {
  const sql = "DELETE FROM user WHERE id=? AND action='supplier'";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

router.put("/updatesupplier/:id", (req, res) => {
  const { name, email, mobile, brand } = req.body;

  
  const sqlUser = "UPDATE user SET name=?, email=?, mobile=? WHERE id=? AND action='supplier'";
  db.query(sqlUser, [name, email, mobile, req.params.id], (err, result) => {
    if (err) {
      console.error("User update failed:", err);
      return res.status(500).json({ error: "User update failed" });
    }

  
    const sqlSupplier = "UPDATE supplier SET brand=? WHERE supid=?";
    db.query(sqlSupplier, [brand, req.params.id], (err2, result2) => {
      if (err2) {
        console.error("Supplier update failed:", err2);
        return res.status(500).json({ error: "Supplier update failed" });
      }

      res.json({ success: true, message: "Supplier updated successfully" });
    });
  });
});



export default router;
