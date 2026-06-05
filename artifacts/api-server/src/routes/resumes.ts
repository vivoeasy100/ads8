import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, resumesTable } from "@workspace/db";
import { CreateResumeBody, UpdateResumeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/curriculos", async (_req, res) => {
  const resumes = await db.select().from(resumesTable).orderBy(resumesTable.updatedAt);
  res.json(resumes);
});

router.post("/curriculos", async (req, res) => {
  const body = CreateResumeBody.parse(req.body);
  const [resume] = await db
    .insert(resumesTable)
    .values({ ...body, updatedAt: new Date() })
    .returning();
  res.status(201).json(resume);
});

router.get("/curriculos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, id));
  if (!resume) {
    res.status(404).json({ error: "Currículo não encontrado" });
    return;
  }
  res.json(resume);
});

router.put("/curriculos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateResumeBody.parse(req.body);
  const [resume] = await db
    .update(resumesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(resumesTable.id, id))
    .returning();
  if (!resume) {
    res.status(404).json({ error: "Currículo não encontrado" });
    return;
  }
  res.json(resume);
});

router.delete("/curriculos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(resumesTable).where(eq(resumesTable.id, id));
  res.status(204).send();
});

export default router;
