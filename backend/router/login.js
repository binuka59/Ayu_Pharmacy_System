import express from "express";
import db from "../db.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


dotenv.config();

const router = express.Router();

router.use(express.json());
router.use(cors());

/*----------------------------------------LOGIN----------------------------------------- */

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
        return res.status(401).json({ error: "Invalid Email Address" });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const action = user.Action;
      console.log("Logged in user action:", action);

      // JWT token generate
      const token = jwt.sign(
        {id: user.id, email: user.email, role: user.Action },
        process.env.SECRET_KEY,  // make sure you have SECRET_KEY in your .env
        { expiresIn: '2h' }
      );

      // return token along with user info
      return res.status(200).json({message: "Login success",user,action,token});
      

    } catch (compareError) {
      console.error("Password compare error:", compareError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});



/*------------------------------GET LOGIN USER (Navbar)--------------------------------------- */

router.get("/updateExpireDays", (req, res) => {

  const sql = `
    SELECT Iid, MIN(expiredate) AS expiredate
    FROM stock
    GROUP BY Iid
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    const today = new Date();

    results.forEach((row) => {

      const end = new Date(row.expiredate);
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

      let daysText = "";

      if (diffDays < 0) {
        daysText = "Expired";
      } else if (diffDays === 0) {
        daysText = "Expires Today";
      } else {
        daysText = diffDays + " Days To Expire";
      }

      db.query(
        "UPDATE item SET days=? WHERE Iid=?",
        [daysText, row.Iid]
      );

    });

    res.json({ message: "Updated" });
  });
});

router.get("/user", (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const sql = "SELECT id,name,email,mobile FROM user WHERE email = ?";
  
    db.query(sql, [decoded.email], (err, result) => {

      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json(result[0]);

    });

  });

});


/*----------------------EMAIL TRANSPORTER--------------------------------- */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayupharmacys@gmail.com",
    pass: process.env.EMAIL_PASS
  }
});

let disemail = null;


/* ===========================
   RESET PASSWORD (Send OTP)
=========================== */

router.post("/Reset", (req, res) => {

  const { email } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], (err, results) => {

    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Incorrect Email Address" });
    }

    disemail = email;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const updateSql = "UPDATE user SET verifycode = ? WHERE email = ?";

    db.query(updateSql, [otp, email]);

    const mailOptions = {
      from: "ayupharmacys@gmail.com",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${otp}`
    };

    transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent" });

  });

});


/* ===========================
   VERIFY OTP
=========================== */

router.post("/Verify", (req, res) => {

  const { OTPCode } = req.body;

  const sql = "SELECT * FROM user WHERE verifycode = ?";

  db.query(sql, [OTPCode], (err, results) => {

    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid OTP Code" });
    }

    res.json({
      message: "OTP verified",
      email: results[0].email
    });

  });

});


/* ===========================
   SET NEW PASSWORD
=========================== */

router.post("/Passwordset", async (req, res) => {

  const { newpass, compass } = req.body;

  if (newpass !== compass) {
    return res.status(400).json({ error: "Password not matched" });
  }

  const hashedPassword = await bcrypt.hash(newpass, 10);

  const sql = "UPDATE user SET password = ? WHERE email = ?";

  db.query(sql, [hashedPassword, disemail], (err) => {

    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Password updated successfully"
    });

  });

});

router.post("/checkpassword", (req, res) => {

  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];

  const { password } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

    if (err) return res.status(401).json({ error: "Invalid token" });

    const sql = "SELECT * FROM user WHERE email = ?";

    db.query(sql, [decoded.email], async (err, result) => {

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Wrong password" });
      }

      res.json({ message: "Password correct" });

    });

  });

});

router.put("/updateprofile", (req, res) => {

  const { name, email, mobile, id } = req.body;

  const sql = "UPDATE user SET name=?, email=?, mobile=? WHERE id=?";

  db.query(sql, [name, email, mobile, id], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Update Failed" });
    }

    return res.status(200).json({ message: "Profile Updated" });

  });

});

export default router;

