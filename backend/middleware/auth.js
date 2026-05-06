const verifyToken = (req, res, next) => {

  console.log("Headers:", req.headers.authorization); // debug

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, decoded) => {

    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();

  });

};