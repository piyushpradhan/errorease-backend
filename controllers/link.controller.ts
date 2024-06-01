import { Request, Response } from "express";
import { generateResponse } from "../utils/response";

import { createLink as createLinkService, updateLinks as updateLinkService } from "../services/link.service";

export const createLink = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { id, note, url } = request.body;
  if (user) {
    const createdLink = await createLinkService({ id, url, note });
    const result = generateResponse({ data: createdLink });

    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
};


export const updateLinks = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { issueId, links = [] } = request.body;

  if (user) {
    const updatedIssue = await updateLinkService({
      links,
      issueId,
      uid: user.id
    });

    const result = generateResponse({ data: updatedIssue });

    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
}
