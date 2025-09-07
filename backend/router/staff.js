import express from "express";
import db from "../db.js"; 
const router = express.Router();
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


// Get all staff
router.get("/getstaff", (req, res) => {
  const sql = "SELECT * FROM user WHERE action='staff' ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});




router.post("/Addstaff", async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match. Try again" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO user (name, email, mobile, password, action) VALUES (?,?,?,?,?)";
    db.query(sql, [name, email, mobile, hashedPassword, "staff"], (err, result) => {
      if (err) {
        console.error("Insert failed:", err);
        return res.status(500).json({ error: "Insert failed" });
      }

      
      res.status(200).json({
        message: "Staff added successfully",
        id: result.insertId,
        name,
        email,
        mobile,
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

        Email_Address:${email}
        Password :${password}

            Best regards,
            Ayu Pharmacy 
            Colombo Road, Pothuhera.`,
      };

      transporter.sendMail(mailOptions);

    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Update staff
router.put("/updatestaff/:id", (req, res) => {
  const { name, email, mobile } = req.body;
  const sql = "UPDATE user SET name=?, email=?, mobile=? WHERE id=? AND action=?";
  db.query(sql, [name, email, mobile, req.params.id, "staff"], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ success: true });
  });
});


// Delete staff
router.delete("/deletestaff:id", (req, res) => {
  const sql = "DELETE FROM user WHERE id=? AND action=?";
  db.query(sql, [req.params.id,"Staff"], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

export default router;
