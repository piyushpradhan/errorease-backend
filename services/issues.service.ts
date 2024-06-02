import e from "../dbschema/edgeql-js";
import { createClient } from "edgedb";
import { LabelInput } from "../utils/types";
import { io } from "../";
import dotenv from "dotenv";

dotenv.config();

const dbClient = createClient({
  instanceName: process.env.EDGEDB_INSTANCE,
  secretKey: process.env.EDGEDB_SECRET_KEY
});

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

  // Send updated values of all the issues the client
  io.emit("updated:issues", issues);

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
    is_active: false,
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

  await getAllIssues({ uid });

  return result;
};

export const updateIssue = async ({
  uid,
  id,
  title,
  description,
  labels,
  links,
  isActive,
  issueMap,
}: {
  uid: string;
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

  if (labels && labels.length > 0) {
    const updateLabelQuery = e.params(
      {
        labels: e.array(
          e.tuple({
            name: e.str,
          }),
        ),
        currentUserId: e.str,
        issueId: e.uuid,
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
                filter_single: { id: params.issueId },
              })),
            })
            .unlessConflict((dbLabel) => ({
              on: dbLabel.name,
              else: e.update(e.Label, () => ({
                filter_single: { name: label.name },
                set: {
                  issue: {
                    "+=": e.select(e.Issue, () => ({
                      filter_single: { id: params.issueId },
                    })),
                  },
                },
              })),
            })),
        ),
    );


    await updateLabelQuery.run(dbClient, {
      labels: labels.map((label) => ({ name: label })),
      currentUserId: uid,
      issueId: id,
    });
  }

  if (title || description || isActive || issueMap) {
    const updateIssueQuery = e.update(e.Issue, () => ({
      filter_single: { id },
      set: {
        title,
        description,
        is_active: isActive,
        issue_map: issueMap,
      },
    }));

    await updateIssueQuery.run(dbClient);
  }

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

  // Send updated values to the client
  await getAllIssues({ uid });

  return result;
};

export const resolveIssue = async ({ id, uid }: { id: string, uid: string }) => {
  const resolveIssueQuery = e.update(e.Issue, () => ({
    filter_single: { id },
    set: {
      status: "Closed",
    },
  }));

  const result = await resolveIssueQuery.run(dbClient);

  // Send updated values to the client
  await getAllIssues({ uid });

  return result;
};

export const updateActiveStatus = async ({ uid, id, isActive }: { uid: string, id: string, isActive: boolean }) => {
  if (!isActive) {
    const deactivateIssueQuery = e.params(
      {
        issueId: e.uuid
      },
      (params) => e.update(e.Issue, (issue) => ({
        filter: e.op(issue.id, "!=", params.issueId),
        set: {
          is_active: false
        }
      }))
    )

    await deactivateIssueQuery.run(dbClient, {
      issueId: id
    });
  }

  const updateActiveStatusQuery = e.update(e.Issue, () => ({
    filter_single: { id },
    set: {
      is_active: isActive
    }
  }));

  const result = await updateActiveStatusQuery.run(dbClient);

  // Send updated issues to the client
  await getAllIssues({ uid });

  return result;
}
