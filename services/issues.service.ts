import e from "../dbschema/edgeql-js";
import { createClient } from "edgedb";
import { LabelInput } from "../utils/types";

const dbClient = createClient();

export const getAllIssues = async ({ uid }: { uid: string }) => {
  const query = e.select(e.Issue, (issue) => ({
    ...e.Issue["*"],
    labels: {
      ...e.Label["*"],
    },
    links: {
      ...e.Link["*"],
    },
    filter: e.op(issue.owner.uid, "=", `${uid}`),
  }));

  const issues = await query.run(dbClient);
  return issues || [];
};

export const createIssue = async ({
  uid,
  title,
  labels = [],
}: {
  uid: string;
  title: string;
  labels?: Array<LabelInput>;
}) => {
  const createIssueQuery = e.insert(e.Issue, {
    title,
    owner: e.select(e.User, () => ({
      filter_single: { uid },
    })),
    created_at: e.datetime_current(),
    updated_at: e.datetime_current(),
    status: "Open",
    is_active: true,
    issue_map: "",
  });

  // CREATE issue
  const createdIssue = await createIssueQuery.run(dbClient);

  // UPDATE labels
  const updateLabelQuery = e.params(
    {
      labels: e.array(
        e.tuple({
          name: e.str,
        }),
      ),
      currentUserId: e.str,
      createdIssueId: e.uuid,
    },
    (params) =>
      e.for(e.array_unpack(params.labels), (label) =>
        e
          .insert(e.Label, {
            name: label.name,
            owner: e.select(e.User, () => ({
              filter_single: { uid: params.currentUserId },
            })),
            issue: e.select(e.Issue, () => ({
              filter_single: { id: params.createdIssueId },
            })),
          })
          .unlessConflict((dbLabel) => ({
            on: dbLabel.name,
            else: e.update(e.Label, () => ({
              filter_single: { name: label.name },
              set: {
                issue: {
                  "+=": e.select(e.Issue, () => ({
                    filter_single: { id: params.createdIssueId },
                  })),
                },
              },
            })),
          })),
      ),
  );

  await updateLabelQuery.run(dbClient, {
    labels: labels.map((label) => ({ name: label.name })),
    currentUserId: uid,
    createdIssueId: createdIssue.id,
  });

  const getUpdatedIssueQuery = e.select(e.Issue, () => ({
    ...e.Issue["*"],
    owner: {
      ...e.User["*"],
    },
    labels: {
      ...e.Label["*"],
    },
    links: {
      ...e.Link["*"],
    },
    filter_single: { id: createdIssue.id },
  }));

  const result = await getUpdatedIssueQuery.run(dbClient);

  return result;
};

export const updateIssue = async ({
  id,
  title,
  description,
  labels,
  links,
  isActive,
  issueMap,
}: {
  id: string;
  title?: string;
  description?: string;
  labels?: Array<string>;
  links?: Array<string>;
  isActive?: boolean;
  issueMap?: string;
}) => {
  if (links && links.length > 0) {
    const updateLinks = e.params(
      {
        links: e.array(
          e.tuple({
            url: e.str,
          }),
        ),
        issueId: e.uuid,
      },
      (params) =>
        e.for(e.array_unpack(params.links), (link) =>
          e.insert(e.Link, {
            url: link.url,
            issue: e.select(e.Issue, () => ({
              filter_single: { id: params.issueId },
            })),
          }),
        ),
    );

    await updateLinks.run(dbClient, {
      links: links.map((link) => ({ url: link })),
      issueId: id,
    });
  }

  const updateIssueQuery = e.update(e.Issue, () => ({
    filter_single: { id },
    set: {
      title,
      description,
      labels,
      is_active: isActive,
      issue_map: issueMap,
    },
  }));

  await updateIssueQuery.run(dbClient);

  const updatedIssueQuery = e.select(e.Issue, () => ({
    ...e.Issue["*"],
    owner: {
      ...e.User["*"],
    },
    labels: {
      ...e.Label["*"],
    },
    links: {
      ...e.Link["*"],
    },
    filter_single: { id },
  }));

  const result = await updatedIssueQuery.run(dbClient);
  return result;
};

export const resolveIssue = async ({ id }: { id: string }) => {
  const resolveIssueQuery = e.update(e.Issue, () => ({
    filter_single: { id },
    set: {
      status: "Closed",
    },
  }));

  const result = await resolveIssueQuery.run(dbClient);
  return result;
};
