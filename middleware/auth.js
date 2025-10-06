// import jwt from "jsonwebtoken";
// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// export const authMiddleware = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token) return res.status(401).json({ success: false, message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // { id, role, school_id }
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };


import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.Authorization;
    // if (!req.headers || !req.headers.authorization) {
        if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    // const token = req.headers.authorization.split(" ")[1];
    // if (!token) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "No token provided" });
    // }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }


    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // ✅ Optional role restriction
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(req.user.role)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: insufficient role" });
      }

      next();
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid token" });
    }
  };
};
