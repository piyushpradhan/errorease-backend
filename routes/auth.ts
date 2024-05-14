import express, { Router, Request, Response } from "express";
import passport from "passport";

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

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/callback/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (request: Request, response: Response) => {
    response.redirect("/api/auth/status");
    response.sendStatus(200);
  },
);

export default router;
