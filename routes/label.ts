import express, { Router } from "express";
import { getAllLabels } from "../services/label.service";
import { ensureAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", ensureAuthenticated, getAllLabels);

export default Router;
