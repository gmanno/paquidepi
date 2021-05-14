import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const prisma = new PrismaClient({
  log: ["query"],
});
const router = express.Router();
const model = prisma.user;

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await model.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const hash = password.length > 0 ? bcrypt.hashSync(password, salt) : null;
      await prisma.user
        .create({
          data: {
            name: name,
            email: email,
            password: hash,
          },
        })
        .then((usr) => {
          res.status(201).json({
            message: "Salvo com sucesso",
            data: usr,
            ok: true,
          });
        })
        .catch((err) => {
          res.json({
            message: err.message,
            error: err,
            ok: false,
          });
        });
    } catch (err) {
      res.json({ message: "Ocorreu um erro", error: err, ok: false });
    }
  })
  .put(authenticateToken, async (req, res, next) => {
    try {
      const user = await model.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
          email: req.body.email,
        },
      });

      res.json(
        res.json({
          message: "Atualizado com sucesso.",
          ok: true,
        })
      );
    } catch (error) {
      res.json({
        error: error.message,
        ok: false,
      });
    }
  });
router.get(`/:id`, authenticateToken, async (req, res, next) => {
  const { id } = req.params;
  await model
    .findFirst({
      where: {
        id: id,
      },
    })
    .then((result) => {
      res.json(
        result === null
          ? {
              message: "Registro não encontrado",
              ok: false,
            }
          : { result: result, ok: true }
      );
    })
    .catch((err) => {
      res.json({
        message: "Registro não encontrado",
        error: err.message,
        ok: false,
      });
    });
});
router.delete(`/:id`, authenticateToken, async (req, res, next) => {
   const { id } = req.params;

  await prisma.user
    .delete({
      where: {
        id: id,
      },
    })
    .then(() => {
      res.json({
        message: "Excluido com sucesso.",
        ok: true,
      });
    })
    .catch((err) => {
      res.json({
        message: "Registro não encontrado",
        error: err.message,
        ok: false,
      });
    });
});

module.exports = router;
