import express, { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth";
import { createLink, updateLinks, deleteLink } from "../controllers/link.controller";

const router: Router = express.Router();

router.get("/create", ensureAuthenticated, createLink);
router.post("/update", ensureAuthenticated, updateLinks);
router.delete("/remove", ensureAuthenticated, deleteLink);

export default router;

