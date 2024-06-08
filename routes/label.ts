import express, { Router } from "express";
import { getAllLabels, removeLabel } from "../controllers/label.controller";
import { ensureAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", ensureAuthenticated, getAllLabels);
router.post("/remove", ensureAuthenticated, removeLabel);

export default router;
