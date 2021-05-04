import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";

const prisma = new PrismaClient();
const router = express.Router();

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    try {
      const { name, email,  phone, cpf} = req.body;
      await prisma.category
        .create({
          data: {
            name: name
          },
        })
        .then((rec) => {
          res.status(201).json({
            message: "Salvo com sucesso",
            data: rec,
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
      const rec = await prisma.category.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name
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

  await prisma.category
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
