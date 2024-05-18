import express, { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth";
import { getUserDetails } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/details", ensureAuthenticated, getUserDetails);

export default router;
