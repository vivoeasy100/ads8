import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, indicatorsTable } from "@workspace/db";
import { CreateIndicatorBody, UpdateIndicatorBody } from "@workspace/api-zod";

const router: IRouter = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const indicators = await db
    .select()
    .from(indicatorsTable)
    .where(eq(indicatorsTable.companyId, companyId))
    .orderBy(indicatorsTable.createdAt);
  res.json(indicators);
});

router.post("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const body = CreateIndicatorBody.parse(req.body);
  const [indicator] = await db
    .insert(indicatorsTable)
    .values({ ...body, companyId })
    .returning();
  res.status(201).json(indicator);
});

router.put("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  const body = UpdateIndicatorBody.parse(req.body);
  const [indicator] = await db
    .update(indicatorsTable)
    .set(body)
    .where(and(eq(indicatorsTable.id, id), eq(indicatorsTable.companyId, companyId)))
    .returning();
  if (!indicator) {
    res.status(404).json({ error: "Indicador não encontrado" });
    return;
  }
  res.json(indicator);
});

router.delete("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  await db
    .delete(indicatorsTable)
    .where(and(eq(indicatorsTable.id, id), eq(indicatorsTable.companyId, companyId)));
  res.status(204).send();
});

export default router;
