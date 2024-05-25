import express, { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const router: Router = express.Router();

const successLoginUrl = `${process.env.APP_URL}/dashboard`;
const failureLoginUrl = `${process.env.APP_URL}/`;

router.get(
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
  passport.authenticate("github", { scope: ["user:email", "user:profile"] }),
);

router.get(
  "/callback/github",
  passport.authenticate("github"),
  (request: Request, response: Response) => {
    const user = request.user as any;
    if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
      );

      response.setHeader("Set-Cookie", accessToken);

      response.cookie("access_token", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
        domain: "errorease-web.vercel.app",
        path: "/"
      });

      response.cookie("refresh_token", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
        domain: "errorease-web.vercel.app",
        path: "/"
      });

      return response.redirect(successLoginUrl);
    }
    throw new Error("Token secrets not found");
  },
);

export default router;
