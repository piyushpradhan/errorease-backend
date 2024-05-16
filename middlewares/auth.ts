import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const ensureAuthenticated = (request: Request, response: Response, next: NextFunction) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Token secrets not found");
  }

  const token = request.cookies.access_token;

  if (!token) {
    return response.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error: VerifyErrors | null, user: JwtPayload | string | undefined) => {
    if (error) {
      if (error.message === "jwt expired") {
        verifyRefreshToken(request, response, next, token);
      }
      return response.sendStatus(401);
    }

    request.user = user;
    next();
  });
}

const verifyRefreshToken = (request: Request, response: Response, next: NextFunction, token: string) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Token secret not found");
  }
  jwt.verify(request.cookies.refresh_token, process.env.REFRESH_TOKEN_SECRET, (error: VerifyErrors | null, user: JwtPayload | string | undefined) => {
    if (error) {
      response.statusCode = 401;
      response.send({
        type: "session expired",
        message: "Session expired please login again"
      });
    }

    request.user = user;
    next();
  })

}
