import { Request, Response } from "express";
import { generateResponse } from "../utils/response";
import { getAllLabels as getAllLabelsService, removeLabelFromIssue } from "../services/label.service";

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

export const removeLabel = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { issueId, labelId } = request.body;
  if (user) {
    await removeLabelFromIssue({ uid: user.id ?? user.user.id, issueId, labelId })
    const result = generateResponse({ data: true });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: [] })
  );
}
