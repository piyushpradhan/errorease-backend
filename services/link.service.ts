import e, { createClient } from "../dbschema/edgeql-js";
import * as R from "ramda";
import { getAllIssues } from "./issues.service";

const dbClient = createClient();

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
