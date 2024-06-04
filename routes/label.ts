import express, { Router } from "express";
import { getAllLabels } from "../controllers/label.controller";
import { ensureAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", ensureAuthenticated, getAllLabels);

export default router;
