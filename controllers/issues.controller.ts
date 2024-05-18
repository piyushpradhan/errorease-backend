import { Request, Response } from "express";
import {
  getAllIssues as getAllIssuesService,
  createIssue as createIssueService,
  updateIssue as updateIssueService,
  resolveIssue as resolveIssueService,
} from "../services/issues.service";
import { generateResponse } from "../utils/response";

export const getAllIssues = async (request: Request, response: Response) => {
  const user = request.user as any;
  if (user) {
    const issues = await getAllIssuesService({ uid: user.user.id });
    const result = generateResponse({ data: issues });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: [] }),
  );
};

export const createIssue = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { title, labels } = request.body;
  if (user) {
    const createdIssue = await createIssueService({
      uid: user.id,
      title,
      labels,
    });
    const result = generateResponse({ data: createdIssue });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
};

export const updateIssue = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { id, title, description, labels, isActive, issueMap } = request.body;

  if (user) {
    const updatedIssue = await updateIssueService({
      id,
      title,
      description,
      labels,
      isActive,
      issueMap,
    });
    const result = generateResponse({ data: updatedIssue });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
};

export const resolveIssue = async (request: Request, response: Response) => {
  const user = request.user as any;
  const { id } = request.body;

  if (user) {
    const resolvedIssue = await resolveIssueService({ id });
    const result = generateResponse({ data: resolvedIssue });
    return response.send(result);
  }

  return response.send(
    generateResponse({ statusCode: 401, error: "Unauthorized user", data: {} }),
  );
};
