import express, { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth";
import { createLink } from "../controllers/link.controller";

const router: Router = express.Router();

router.get("/create", ensureAuthenticated, createLink);

export default router;

