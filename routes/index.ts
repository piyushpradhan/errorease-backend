import express, { Router } from "express";
import authRouter from "./auth";
import issuesRouter from "./issues";
import userRouter from "./user";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/issues", issuesRouter);
router.use("/user", userRouter);

export default router;
