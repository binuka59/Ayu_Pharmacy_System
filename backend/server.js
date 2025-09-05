<<<<<<< HEAD
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql2";   // use mysql2 (better support with Node.js ESM)
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url"; // needed for __dirname in ESM
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';



// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Binu@9876",
  database: "pharmacy",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayupharmacys@gmail.com",
    pass: "pvtr brmn nwtb sivm", // Gmail app password
  },
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM login WHERE email = ?";
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
        { email: user.email, role: user.Action },
        process.env.SECRET_KEY,  // make sure you have SECRET_KEY in your .env
        { expiresIn: '1h' }
      );

      // return token along with user info
      return res.status(200).json({message: "Login success",user,action,token});

    } catch (compareError) {
      console.error("Password compare error:", compareError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});


let disemail = null;
app.post("/Reset", (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];
       disemail = user.email;
      

      //-------------------------------------generate random 6-digit number-------------------------------------
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      console.log("random number", randomNum);

      // update DB with random code
      const updateSql = "UPDATE login SET Code = ? WHERE email = ?";
      db.query(updateSql, [randomNum, disemail], (err) => {
        if (err) {
          console.error("Error updating:", err);
        }
      });

      // send email
      const mailOptions = {
        from: "ayupharmacys@gmail.com",
        to: disemail,
        subject: "Your Verification Code",
        text: `Don't Share with Others...

            Your verification code is: ${randomNum}

            Best regards,
            Ayu Pharmacy 
            Colombo Road, Pothuhera.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.status(200).json({ message: "success", user });
    } else {
      console.log("Incorrect Email Address");
      res.status(401).json({ error: "Incorrect Email Address." });
    }
  });
});

// /Verify
app.post("/Verify", (req, res) => {
  const { OTPCode } = req.body;
  const sql = "SELECT * FROM login WHERE Code = ?";

  db.query(sql, [OTPCode], (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Code not found." });
    }

    const user = results[0];
    if (OTPCode != user.Code) {
      return res.status(401).json({ error: "Incorrect OTP Code." });
    }

   
    return res.status(200).json({ message: "success", email: user.email });
  });



  // console.log("number1 is"+OTPCode);
});


app.post("/Passwordset", async (req, res) => {
  const { newpass, compass } = req.body;

  if (newpass !== compass) {
    return res.status(400).json({ error: "Password not Matched." });
  }

  try {
   
    const hashedPassword = await bcrypt.hash(newpass, 10);

    const sql = "UPDATE login SET password = ? WHERE email = ?";
    db.query(sql, [hashedPassword, disemail], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      
      return res.status(200).json({ message: "Password updated successfully.", user: result[0]  });
      
    });
  } catch (err) {
    console.error("Hashing error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
=======
import express from "express";
import categoryRoutes from "./router/category.js";
import loginRoutes from "./router/login.js";
import customerRoutes from "./router/customer.js";
import staffRoutes from "./router/staff.js";
import supplierRoutes from "./router/supplier.js";
import DashboardRoutes from "./router/dashboard.js";



import dotenv from "dotenv";
dotenv.config();
import cors from "cors";  
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url"; 
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/category", categoryRoutes);
app.use("/api/log", loginRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/dashboard", DashboardRoutes);

>>>>>>> 792cc480 (second commit)


app.listen(5000, () => {
  console.log("Listening ");
});
