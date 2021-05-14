import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../util/authenticateToken";

const prisma = new PrismaClient({
  log: ["query"],
});
const router = express.Router();

const model = prisma.vehicle;

router
  .route("/")
  .get(authenticateToken, async (req, res, next) => {
    const result = await model.findMany({
      select: {
        id: true,
        license: true,
        owner: true,
        category: true,
      },
    });
    res.json(result);
  })
  .post(authenticateToken, async (req, res, next) => {
    // try {
    const { license, clientId, categoryId } = req.body;
    await model
      .create({
        data: {
          license: license,
          categoryId: categoryId,
          clientId: clientId,
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
    // } catch (err) {
    //   res.json({ message: "Ocorreu um erro", error: err, ok: false });
    // }
  })
  .put(authenticateToken, async (req, res, next) => {
    try {
      const { license, clientId, categoryId } = req.body;
      const rec = await model.update({
        where: { id: req.body.id },
        data: {
          license: license,
          categoryId: categoryId,
          clientId: clientId,
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
