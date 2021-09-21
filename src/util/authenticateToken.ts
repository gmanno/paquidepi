import { Response, Request, NextFunction } from "express";

const jwt = require("jsonwebtoken");

interface decodedUser {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const getToken = (req: Request) => {
  const auth = req.headers["authorization"];
  return auth != null ? auth.split(" ").slice(-1).pop() : false;
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getToken(req);

    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    jwt.verify(
      token,
      process.env.SECRET,
      function (err: any, decoded: decodedUser) {
        if (err)
          return res.status(401).json({
            auth: false,
            message: "Failed to authenticate token.",
            error: err,
          });

        res.locals.current_user = decoded.user;
        next();
      }
    );
  } catch (err) {
    return res.status(401).json({
      auth: false,
      message: "Failed to authenticate token.",
      error: "Failed to authenticate token.",
    });
  }
};
export default authenticateToken;
