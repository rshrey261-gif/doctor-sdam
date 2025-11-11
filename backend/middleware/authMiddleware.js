// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ✅ Protect middleware — verifies JWT and attaches user to request
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user)
        return res.status(404).json({ message: "User not found" });

      // ✅ Attach decoded ID explicitly (some models use req.user.id instead of _id)
      req.user.id = decoded.id;

      next();
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// ✅ Allow only doctors
export const verifyDoctor = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== "doctor") {
    return res.status(403).json({ message: "Access denied: doctor only" });
  }
  next();
};

export default protect;
