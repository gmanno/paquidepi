import { PrismaClient } from "@prisma/client";
import express, { NextFunction } from "express";
import authenticateToken from "./util/authenticateToken";

const compression = require("compression");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
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
              expiresIn: 10000, // expires in 5min
            });
            res.json({
              result: true,
              message: "Login realizado com sucesso",
              token: { access_token },
            });
          } else {
            res.json({ error: "Senha inválida" });
          }
        })
        .catch(() => {
          res.json({ error: "E-mail não cadastrado." });
        });
    });
});

app.post("/logout", function (req, res) {
  res.json({ result: true, auth: false, token: null });
});

app.post(`/me`, authenticateToken, (req, res, next) => {
  res.json({ user: res.locals.current_user });
});

app.get("/", (req, res) => {
  res.json({
    message: "Paquidepi API",
  });
});

app.use("/users", require("./routes/users"));

app.use("/clients", require("./routes/clients"));

app.use("/vehicles_categories", require("./routes/vehicles_categories"));

app.use("/scheduling_status", require("./routes/scheduling_status"));

app.use("/vehicles", require("./routes/vehicles"));

app.use("/services", require("./routes/services"));

app.listen(process.env.PORT || 4000, () =>
  console.log(`
🚀 Server ready at port ${process.env.PORT}
⭐️ Check repo at: https://github.com/gmanno/paquidepi`)
);
