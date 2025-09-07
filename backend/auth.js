const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Fake in-memory user for testing
const fakeUser = {
  email: "test@example.com",
  password: "$2b$10$9AWd3gaP6PnBBzkjWNwn3O62gjFTbOGhnbmGukmNrGgFdeByQlZoS", 
  Action: "admin",
  Code: null
};

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== fakeUser.email) {
    return res.status(401).json({ error: "Invalid Email Address" });
  }

  const isMatch = await bcrypt.compare(password, fakeUser.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ email: fakeUser.email, role: fakeUser.Action }, "secretkey", { expiresIn: "1h" });

  res.status(200).json({ message: "Login success", user: fakeUser, token });
});

module.exports = router;
