import { PrismaClient } from "@prisma/client";
import express from "express";
import { Hash } from "node:crypto";

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

app.post(`/login`, async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  const data = { id: user?.id, name: user?.name, email: user?.email };
  const result = await bcrypt
    .compare(password, user?.password)
    .then((matched: boolean) => {
      if (matched) {
         const token = jwt.sign(data, process.env.SECRET, {
           expiresIn: 300, // expires in 5min
         });
        return { message: "Login realizado com sucesso", token };
      } else {
        return { message: "Senha inválida" };
      }
    })
    .catch((err: any) => {
      return { message: "E-mail não cadastrado." };
    });

  res.json(result);
});

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

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
