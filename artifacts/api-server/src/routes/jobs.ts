import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, jobsTable, coursesTable, resumesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/vagas", async (_req, res) => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.isActive, true)).orderBy(jobsTable.createdAt);
  res.json(jobs);
});

router.get("/vagas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  if (!job) {
    res.status(404).json({ error: "Vaga não encontrada" });
    return;
  }
  res.json(job);
});

router.get("/cursos", async (_req, res) => {
  const courses = await db.select().from(coursesTable).orderBy(coursesTable.createdAt);
  res.json(courses);
});

router.get("/cursos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) {
    res.status(404).json({ error: "Curso não encontrado" });
    return;
  }
  res.json(course);
});

router.get("/recomendacoes", async (req, res) => {
  const curriculoId = req.query.curriculoId ? Number(req.query.curriculoId) : null;

  let resumeSkills: string[] = [];
  let resumeArea = "";

  if (curriculoId) {
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, curriculoId));
    if (resume) {
      try {
        const skills: Array<{ name: string }> = JSON.parse(resume.skills || "[]");
        resumeSkills = skills.map((s) => s.name.toLowerCase());
      } catch {
        resumeSkills = [];
      }
    }
  }

  const allJobs = await db.select().from(jobsTable).where(eq(jobsTable.isActive, true));
  const allCourses = await db.select().from(coursesTable);

  function scoreJob(job: typeof allJobs[0]): number {
    if (resumeSkills.length === 0) return Math.random();
    try {
      const jobSkills: string[] = JSON.parse(job.skills || "[]").map((s: string) => s.toLowerCase());
      const matches = resumeSkills.filter((rs) => jobSkills.some((js) => js.includes(rs) || rs.includes(js)));
      return matches.length / Math.max(jobSkills.length, 1);
    } catch {
      return 0;
    }
  }

  function scoreCourse(course: typeof allCourses[0]): number {
    if (resumeSkills.length === 0) return Math.random();
    try {
      const courseSkills: string[] = JSON.parse(course.skills || "[]").map((s: string) => s.toLowerCase());
      const matches = resumeSkills.filter((rs) => courseSkills.some((cs) => cs.includes(rs) || rs.includes(cs)));
      return matches.length / Math.max(courseSkills.length, 1);
    } catch {
      return 0;
    }
  }

  const scoredJobs = allJobs.map((j) => ({ ...j, _score: scoreJob(j) })).sort((a, b) => b._score - a._score).slice(0, 6);
  const scoredCourses = allCourses.map((c) => ({ ...c, _score: scoreCourse(c) })).sort((a, b) => b._score - a._score).slice(0, 6);

  res.json({
    jobs: scoredJobs.map(({ _score, ...j }) => j),
    courses: scoredCourses.map(({ _score, ...c }) => c),
  });
});

export default router;
