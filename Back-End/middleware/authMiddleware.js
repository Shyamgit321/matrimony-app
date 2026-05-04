const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // ===============================
    // CHECK TOKEN IN HEADER
    // ===============================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ===============================
    // VERIFY TOKEN
    // ===============================
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user id
    req.user = {
      id: decoded.id
    };

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Token is not valid or expired"
    });
  }
};