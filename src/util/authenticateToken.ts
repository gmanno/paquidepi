import { Response, Request, NextFunction } from "express";

const jwt = require("jsonwebtoken");

interface decodedUser {
  user: {
    id: string;
    name: string;
    email: string;
  };
}


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers["authorization"];
    const token = auth!=null? auth.split(" ").slice(-1).pop() : false;

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

        // se tudo estiver ok, salva no request para uso posterior
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
