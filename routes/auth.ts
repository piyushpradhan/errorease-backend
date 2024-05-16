import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const router: Router = express.Router();

router.post(
  "/",
  passport.authenticate("github"),
  (request: Request, response: Response) => {
    response.sendStatus(200);
  },
);

router.get("/status", (request: Request, response: Response) => {
  return request.user ? response.send(request.user) : response.sendStatus(400);
});

router.get("/logout", (request: Request, response: Response) => {
  if (!request.user) return response.sendStatus(200);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/callback/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (request: Request, response: Response) => {
    const user = request.user as any;
    if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
      const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

      response.setHeader("Set-Cookie", accessToken);

      response.cookie("access_token", accessToken, { httpOnly: true, secure: true });
      response.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });

      response.redirect("/api/auth/status");
    }
    throw new Error("Token secrets not found")
  },
);

export default router;
