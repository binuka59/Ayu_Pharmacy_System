import express from "express";
import categoryRoutes from "./router/category.js";
import loginRoutes from "./router/login.js";
import customerRoutes from "./router/customer.js";
import staffRoutes from "./router/staff.js";
import supplierRoutes from "./router/supplier.js";
import DashboardRoutes from "./router/dashboard.js";
import BillRoutes from "./router/bill.js";
// import app from "./app.js"; 



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
app.use("/api/bill", BillRoutes);



app.listen(5000, () => {
  console.log("Listening ");
});
