import { PrismaClient } from "@prisma/client";
import express from "express";
import  authenticateToken  from "./util/authenticateToken";


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
              expiresIn: 6000, // expires in 5min
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

var users = require("./routes/users");
app.use("/users", users);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ Check repo at: https://github.com/gmanno/paquidepi`)
);
