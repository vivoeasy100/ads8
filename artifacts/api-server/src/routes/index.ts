import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import companiesRouter from "./companies";
import indicatorsRouter from "./indicators";
import employeesRouter from "./employees";
import trainingsRouter from "./trainings";
import dashboardRouter from "./dashboard";
import resumesRouter from "./resumes";
import jobsRouter from "./jobs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(companiesRouter);
router.use("/companies/:companyId/indicators", indicatorsRouter);
router.use("/companies/:companyId/employees", employeesRouter);
router.use("/companies/:companyId/trainings", trainingsRouter);
router.use(dashboardRouter);
router.use(resumesRouter);
router.use(jobsRouter);

export default router;
