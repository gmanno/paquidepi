import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";

const prisma = new PrismaClient();
const router = express.Router();

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await prisma.employee.findMany();
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    try {
      const { name, email, cpf, phone } = req.body;
      await prisma.employee
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
      const rec = await prisma.employee.update({
        where: { id: req.body.id },
        data: {
          name: name,
          email: email,
          cpf: cpf,
          phone: phone,
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

router.delete(`/:id`, authenticateToken, async (req, res, next) => {
  const { id } = req.params;

  await prisma.employee
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
        message: "Record not found",
        error: err.message,
        ok: false,
      });
    });
});

module.exports = router;