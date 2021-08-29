import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";

const prisma = new PrismaClient();
const router = express.Router();
const model = prisma.client;

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await model.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    try {
      const { name, email, phone, cpf } = req.body;
      await model
        .create({
          data: {
            name: name,
            cpf: cpf,
            email: email,
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
          let msg = "Ocorreu um erro";
          if (err.code == "P2002") {
            msg = `${err.meta.target} já cadastrado no sistema.`;
          }
          res.json({
            message: msg,
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
      const rec = await model.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
          email: req.body.email,
          cpf: req.body.cpf,
          phone: req.body.phone,
        },
      });

      res.json({
        message: "Atualizado com sucesso.",
        ok: true,
      });
    } catch (err) {
      let msg = "Ocorreu um erro";
      if (err.code == "P2002") {
        msg = `${err.meta.target} já cadastrado no sistema.`;
      }
      res.json({
        message: msg,
        error: err,
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
