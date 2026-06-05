import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, employeesTable } from "@workspace/db";
import { CreateEmployeeBody, UpdateEmployeeBody } from "@workspace/api-zod";

const router: IRouter = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const employees = await db
    .select()
    .from(employeesTable)
    .where(eq(employeesTable.companyId, companyId))
    .orderBy(employeesTable.name);
  res.json(employees);
});

router.post("/", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const body = CreateEmployeeBody.parse(req.body);
  const [employee] = await db
    .insert(employeesTable)
    .values({ ...body, companyId })
    .returning();
  res.status(201).json(employee);
});

router.put("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  const body = UpdateEmployeeBody.parse(req.body);
  const [employee] = await db
    .update(employeesTable)
    .set(body)
    .where(and(eq(employeesTable.id, id), eq(employeesTable.companyId, companyId)))
    .returning();
  if (!employee) {
    res.status(404).json({ error: "Funcionário não encontrado" });
    return;
  }
  res.json(employee);
});

router.delete("/:id", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const id = Number(req.params.id);
  await db
    .delete(employeesTable)
    .where(and(eq(employeesTable.id, id), eq(employeesTable.companyId, companyId)));
  res.status(204).send();
});

export default router;
