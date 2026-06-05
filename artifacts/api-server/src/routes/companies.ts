import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, companiesTable, insertCompanySchema } from "@workspace/db";
import { CreateCompanyBody, UpdateCompanyBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/companies", async (_req, res) => {
  const companies = await db.select().from(companiesTable).orderBy(companiesTable.createdAt);
  res.json(companies);
});

router.post("/companies", async (req, res) => {
  const body = CreateCompanyBody.parse(req.body);
  const [company] = await db.insert(companiesTable).values(body).returning();
  res.status(201).json(company);
});

router.get("/companies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) {
    res.status(404).json({ error: "Empresa não encontrada" });
    return;
  }
  res.json(company);
});

router.put("/companies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = UpdateCompanyBody.parse(req.body);
  const [company] = await db.update(companiesTable).set(body).where(eq(companiesTable.id, id)).returning();
  if (!company) {
    res.status(404).json({ error: "Empresa não encontrada" });
    return;
  }
  res.json(company);
});

router.delete("/companies/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(companiesTable).where(eq(companiesTable.id, id));
  res.status(204).send();
});

export default router;
