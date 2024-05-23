import express, { Router } from "express";
import { getAllIssues, createIssue, updateIssue, resolveIssue, updateIssueActiveStatus } from "../controllers/issues.controller";
import { ensureAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", ensureAuthenticated, getAllIssues);
router.post("/create", ensureAuthenticated, createIssue);
router.post("/update", ensureAuthenticated, updateIssue);
router.post("/resolve", ensureAuthenticated, resolveIssue);
router.post("/activate", ensureAuthenticated, updateIssueActiveStatus);

export default router;
