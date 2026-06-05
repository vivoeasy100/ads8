import { Router, type IRouter } from "express";
import { eq, count, avg } from "drizzle-orm";
import { db, companiesTable, employeesTable, trainingsTable, indicatorsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const [companiesCount] = await db.select({ count: count() }).from(companiesTable);
  const [employeesCount] = await db.select({ count: count() }).from(employeesTable);
  const [trainingsCount] = await db.select({ count: count() }).from(trainingsTable);

  const companies = await db.select().from(companiesTable);

  const companiesBySize = ["micro", "pequena", "media", "grande"].map((size) => ({
    size,
    count: companies.filter((c) => c.size === size).length,
  }));

  const scores = await Promise.all(
    companies.map(async (c) => {
      const indicators = await db.select().from(indicatorsTable).where(eq(indicatorsTable.companyId, c.id));
      const score = computeOds8Score(indicators);
      return { id: c.id, name: c.name, score: score.overall };
    }),
  );

  const averageOds8Score = scores.length > 0 ? scores.reduce((a, b) => a + b.score, 0) / scores.length : 0;

  const topPerformers = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => ({ id: s.id, name: s.name, score: Math.round(s.score * 10) / 10 }));

  res.json({
    totalCompanies: companiesCount.count,
    totalEmployees: employeesCount.count,
    totalTrainings: trainingsCount.count,
    averageOds8Score: Math.round(averageOds8Score * 10) / 10,
    companiesBySize,
    topPerformers,
  });
});

router.get("/companies/:companyId/ods8-score", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const indicators = await db.select().from(indicatorsTable).where(eq(indicatorsTable.companyId, companyId));
  const employees = await db.select().from(employeesTable).where(eq(employeesTable.companyId, companyId));
  const trainings = await db.select().from(trainingsTable).where(eq(trainingsTable.companyId, companyId));

  const result = computeOds8ScoreDetailed(companyId, indicators, employees, trainings);
  res.json(result);
});

router.get("/companies/:companyId/indicator-trends", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const indicators = await db
    .select()
    .from(indicatorsTable)
    .where(eq(indicatorsTable.companyId, companyId))
    .orderBy(indicatorsTable.period);

  res.json(
    indicators.map((i) => ({
      period: i.period,
      category: i.category,
      value: i.value,
    })),
  );
});

router.get("/companies/:companyId/diversity-breakdown", async (req, res) => {
  const companyId = Number(req.params.companyId);
  const employees = await db.select().from(employeesTable).where(eq(employeesTable.companyId, companyId));

  const total = employees.length;
  const genders = ["masculino", "feminino", "outro", "nao_informado"];
  const genderDistribution = genders.map((gender) => {
    const cnt = employees.filter((e) => e.gender === gender).length;
    return { gender, count: cnt, percentage: total > 0 ? Math.round((cnt / total) * 1000) / 10 : 0 };
  });

  const ageGroups = [
    { group: "18-24", min: 18, max: 24 },
    { group: "25-34", min: 25, max: 34 },
    { group: "35-44", min: 35, max: 44 },
    { group: "45-54", min: 45, max: 54 },
    { group: "55+", min: 55, max: 999 },
  ].map(({ group, min, max }) => ({
    group,
    count: employees.filter((e) => e.age >= min && e.age <= max).length,
  }));

  const formalCount = employees.filter((e) => e.formalContract).length;
  const formalContractRate = total > 0 ? Math.round((formalCount / total) * 1000) / 10 : 0;

  res.json({ genderDistribution, ageGroups, formalContractRate });
});

type IndicatorRow = { category: string; value: number };
type EmployeeRow = { formalContract: boolean; gender: string; age: number };
type TrainingRow = { hoursTotal: number; participantsCount: number };

function computeOds8Score(indicators: IndicatorRow[]) {
  const categories = ["salario", "jornada", "rotatividade", "saude_seguranca", "diversidade", "capacitacao", "trabalho_infantil", "formalidade"];
  let total = 0;
  let weight = 0;
  for (const cat of categories) {
    const items = indicators.filter((i) => i.category === cat);
    if (items.length > 0) {
      const avg = items.reduce((a, b) => a + b.value, 0) / items.length;
      total += Math.min(avg, 100);
      weight++;
    }
  }
  return { overall: weight > 0 ? total / weight : 50 };
}

function computeOds8ScoreDetailed(
  companyId: number,
  indicators: IndicatorRow[],
  employees: EmployeeRow[],
  trainings: TrainingRow[],
) {
  const categoryWeights: Record<string, number> = {
    salario: 0.20,
    jornada: 0.15,
    rotatividade: 0.12,
    saude_seguranca: 0.15,
    diversidade: 0.12,
    capacitacao: 0.10,
    trabalho_infantil: 0.08,
    formalidade: 0.08,
  };

  const breakdown: { category: string; score: number; weight: number }[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [cat, w] of Object.entries(categoryWeights)) {
    const items = indicators.filter((i) => i.category === cat);
    let score = 50;

    if (items.length > 0) {
      const avgVal = items.reduce((a, b) => a + b.value, 0) / items.length;
      score = Math.min(Math.max(avgVal, 0), 100);
    } else if (cat === "formalidade" && employees.length > 0) {
      const formal = employees.filter((e) => e.formalContract).length;
      score = (formal / employees.length) * 100;
    } else if (cat === "capacitacao" && trainings.length > 0) {
      score = Math.min(trainings.length * 10, 100);
    } else if (cat === "diversidade" && employees.length > 0) {
      const uniqueGenders = new Set(employees.map((e) => e.gender)).size;
      score = Math.min(uniqueGenders * 25, 100);
    }

    breakdown.push({ category: cat, score: Math.round(score * 10) / 10, weight: w });
    weightedSum += score * w;
    totalWeight += w;
  }

  const overallScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 50;

  const level =
    overallScore >= 85 ? "excelente" :
    overallScore >= 70 ? "bom" :
    overallScore >= 50 ? "regular" :
    overallScore >= 30 ? "insuficiente" :
    "critico";

  const recommendations: string[] = [];
  const weakCats = breakdown.filter((b) => b.score < 60).sort((a, b) => a.score - b.score);
  if (weakCats.length === 0) {
    recommendations.push("Excelente desempenho! Continue monitorando os indicadores regularmente.");
  }
  for (const cat of weakCats.slice(0, 4)) {
    const recs: Record<string, string> = {
      salario: "Revise a política salarial para garantir salários acima do mínimo regional e equidade entre gêneros.",
      jornada: "Reduza horas extras e promova jornadas flexíveis alinhadas à legislação trabalhista.",
      rotatividade: "Invista em programas de retenção de talentos e pesquisas de clima organizacional.",
      saude_seguranca: "Implemente treinamentos de segurança do trabalho e revise os EPIs disponibilizados.",
      diversidade: "Adote processos seletivos inclusivos e metas de diversidade por gênero, etnia e faixa etária.",
      capacitacao: "Aumente as horas de treinamento por funcionário e diversifique os temas dos programas.",
      trabalho_infantil: "Reforce auditorias na cadeia de fornecimento e implemente política de tolerância zero.",
      formalidade: "Formalize todos os contratos de trabalho e elimine relações de trabalho informais.",
    };
    recommendations.push(recs[cat.category] || `Melhore o indicador de ${cat.category}.`);
  }

  return { companyId, overallScore, level, breakdown, recommendations };
}

export default router;
