const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    console.log("protected route started")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    console.log("no error")
    
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log({decoded: decoded});

    req.user = decoded;
    console.log({userId: decoded.userId});

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

