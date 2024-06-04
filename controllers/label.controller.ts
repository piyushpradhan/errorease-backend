import { Request, Response } from "express";
import { generateResponse } from "utils/response";
import { getAllLabels as getAllLabelsService } from "../services/label.service";

export const getAllLabels = async (request: Request, response: Response) => {
  const user = request.user as any;
  if (user) {
    const labels = await getAllLabelsService({ uid: user.id ?? user.user.id });
    const result = generateResponse({ data: labels });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: [] })
  );
}
