import { Request, Response } from "express";
import { generateResponse } from "../utils/response";
import { getUserDetails as getUserDetailsService } from "../services/user";

export const getUserDetails = async (request: Request, response: Response) => {
  const user = request.user as any;
  if (user) {
    const userDetails = await getUserDetailsService({ uid: user.id });
    const result = generateResponse({ data: userDetails });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
};
