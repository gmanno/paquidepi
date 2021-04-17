import { PrismaClient } from "@prisma/client";
import express from "express";

const compression = require("compression");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(compression());

app.post(`/signup`, async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hash,
    },
  });
  const user = await prisma.user.findFirst({ where: { email: email } });
  res.json(user);
});

app.post(`/login`, async (req, res) => {
  const { email, password } = req.body;
  await prisma.user
    .findFirst({
      where: {
        email: email,
      },
    })
    .then((user) => {
      const data = { id: user?.id, name: user?.name, email: user?.email };
      bcrypt
        .compare(password, user?.password)
        .then((matched: boolean) => {
          if (matched) {
            const access_token = jwt.sign({ user: data }, process.env.SECRET, {
              expiresIn: 600, // expires in 5min
            });
            res.json({
              message: "Login realizado com sucesso",
              token: { access_token },
            });
          } else {
            res.status(401).json({ message: "Senha inválida" });
          }
        })
        .catch(() => {
          res.status(401).json({ message: "E-mail não cadastrado." });
        });
    });
});

const verifyJWT = (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"].split(" ").slice(-1).pop();
    console.log(token);
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

app.get(`/users`, verifyJWT, async (req, res, next) => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(result);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
