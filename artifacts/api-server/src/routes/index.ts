import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toursRouter);

export default router;
