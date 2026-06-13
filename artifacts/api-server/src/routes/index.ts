import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import integrationRequestRouter from "./integrationRequest";
import brandsRouter from "./brands";

const router: IRouter = Router();
router.use(healthRouter);
router.use(waitlistRouter);
router.use(integrationRequestRouter);
router.use(brandsRouter);

export default router;
