import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";

const prisma = new PrismaClient();
const router = express.Router();
const model = prisma.employee;

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await model.findMany();
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    try {
      const { name, email, cpf, phone } = req.body;
      await model
        .create({
          data: {
            name: name,
            email: email,
            cpf: cpf,
            phone: phone,
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
      const { id, name, email, cpf, phone } = req.body;
      const rec = await model.update({
        where: { id: req.body.id },
        data: {
          name: name,
          email: email,
          cpf: cpf,
          phone: phone,
        },
      });

      res.json({
        message: "Atualizado com sucesso.",
        ok: true,
      });
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

  await model
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
