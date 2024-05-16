import express, { Router } from "express";
import authRouter from "./auth";
import issuesRouter from "./issues";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/issues", issuesRouter);

export default router;
