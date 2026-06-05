import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, trainingsTable } from "@workspace/db";
import { CreateTrainingBody, UpdateTrainingBody } from "@workspace/api-zod";

const router: IRouter = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const trainings = await db
    .select()
    .from(trainingsTable)
    .where(eq(trainingsTable.companyId, companyId))
    .orderBy(trainingsTable.createdAt);
  res.json(trainings);
});

router.post("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const body = CreateTrainingBody.parse(req.body);
  const [training] = await db
    .insert(trainingsTable)
    .values({ ...body, companyId })
    .returning();
  res.status(201).json(training);
});

router.put("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  const body = UpdateTrainingBody.parse(req.body);
  const [training] = await db
    .update(trainingsTable)
    .set(body)
    .where(and(eq(trainingsTable.id, id), eq(trainingsTable.companyId, companyId)))
    .returning();
  if (!training) {
    res.status(404).json({ error: "Treinamento não encontrado" });
    return;
  }
  res.json(training);
});

router.delete("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  await db
    .delete(trainingsTable)
    .where(and(eq(trainingsTable.id, id), eq(trainingsTable.companyId, companyId)));
  res.status(204).send();
});

export default router;
