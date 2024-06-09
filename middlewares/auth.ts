import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { extractTokensFromBearer } from "../utils/token";

export const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Token secrets not found");
  }

  let accessToken = request.cookies.access_token;
  let refreshToken = request.cookies.refresh_token;

  if (!accessToken) {
    // Look for the token in auth bearer if they aren't present in cookies
    if (request.headers.authorization) {
      const { accessToken: access, refreshToken: refresh } = extractTokensFromBearer(request.headers.authorization);
      accessToken = access;
      refreshToken = refresh;
    } else {
      return response.sendStatus(401);
    }
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (error: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (error) {
        if (error.message === 'jwt expired') {
          return verifyRefreshToken(request, response, next, refreshToken);
        }
        return response.sendStatus(401);
      }

      request.user = user;
      next();
    },
  );
};

const verifyRefreshToken = (
  request: Request,
  response: Response,
  next: NextFunction,
  token: string,
) => {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Token secret not found");
  }

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (error: VerifyErrors | null, user: JwtPayload | string | undefined) => {
      if (error) {
        return response.status(401).send({
          type: "session expired",
          message: "Session expired, please login again",
        });
      }

      // Generate and set a new access token
      const newAccessToken = jwt.sign({ id: user }, process.env.ACCESS_TOKEN_SECRET || "", { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
      const newRefreshToken = jwt.sign({ id: user }, process.env.REFRESH_TOKEN_SECRET || "", { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
      response.setHeader("Set-Cookie", `access_token=${newAccessToken};refresh_token=${newRefreshToken}`);
      response.cookie("access_token", newAccessToken);
      response.cookie("refresh_token", newRefreshToken);
      request.user = user;
      next();
    },
  );
};
