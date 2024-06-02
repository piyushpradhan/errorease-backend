import e, { createClient } from "../dbschema/edgeql-js";
import * as R from "ramda";
import { getAllIssues } from "./issues.service";
import dotenv from "dotenv";

dotenv.config();

const dbClient = createClient({
  instanceName: process.env.EDGEDB_INSTANCE,
  secretKey: process.env.EDGEB_SECRET_KEY
});

export const createLink = async ({ id, url, note }: { id: string, url: string, note?: string }) => {
  try {
    const createLinkQuery = e.insert(e.Link, {
      url,
      note,
      issue: e.select(e.Issue, () => ({
        filter_single: { id }
      })),
    });

    const result = await createLinkQuery.run(dbClient);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const updateLinks = async ({ links, uid, issueId }: { links: string[], uid: string, issueId: string }) => {
  try {
    const uniqueLinks = R.uniq(links);
    const updateLinksQuery = e.params(
      {
        links: e.array(e.str),
        currentUserId: e.str,
        issueId: e.uuid,
      },
      (params) => e.for(e.array_unpack(params.links), (link) =>
        e.insert(e.Link, {
          url: link,
          issue: e.select(e.Issue, () => ({
            filter_single: { id: params.issueId }
          })),
        }).unlessConflict()
      )
    )

    await updateLinksQuery.run(dbClient, {
      links: uniqueLinks.filter((link) => link.length > 0),
      currentUserId: uid,
      issueId
    });

    const getUpdatedIssue = e.select(e.Issue, () => ({
      ...e.Issue["*"],
      owner: {
        ...e.User["*"],
      },
      labels: {
        ...e.Label["*"]
      },
      links: {
        ...e.Link["*"]
      },
      filter_single: { id: issueId }
    }));

    const result = await getUpdatedIssue.run(dbClient);

    // Send updated issues to the client
    await getAllIssues({ uid });

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const deleteLink = async ({ issue, link, uid }: { link: string, issue: string, uid: string }) => {
  try {
    const deleteLinkQuery = e.delete(e.Link, () => ({
      filter_single: { id: link }
    }));

    await deleteLinkQuery.run(dbClient);

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
      filter_single: { id: issue },
    }));


    const result = await updatedIssueQuery.run(dbClient);
    await getAllIssues({ uid });

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}
