import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import integrationRequestRouter from "./integrationRequest";

const router: IRouter = Router();
router.use(healthRouter);
router.use(waitlistRouter);
router.use(integrationRequestRouter);

export default router;
