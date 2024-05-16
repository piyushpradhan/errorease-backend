import express, { Request, Router, Response } from "express";
import { ensureAuthenticated } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", ensureAuthenticated, (request: Request, response: Response) => {
  response.sendStatus(200);
});

export default router;
