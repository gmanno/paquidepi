const jwt = require("jsonwebtoken");


const authenticateToken = (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"].split(" ").slice(-1).pop();
    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });

    jwt.verify(token, process.env.SECRET, function (err: any, decoded: any) {
      if (err)
        return res.status(500).json({
          auth: false,
          message: "Failed to authenticate token.",
          error: err,
        });

      // se tudo estiver ok, salva no request para uso posterior
      req.current_user = decoded.user;
      next();
    });
  } catch (err) {
    return res.status(500).json({
      auth: false,
      message: "Failed to authenticate token.",
      error: err,
    });
  }
};
export default authenticateToken;
