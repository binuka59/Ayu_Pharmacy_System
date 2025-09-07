const express = require("express");
const cors = require("cors");
const authRouter = require("./auth"); 

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

module.exports = app;
