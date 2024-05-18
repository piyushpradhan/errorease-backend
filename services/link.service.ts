import e, { createClient } from "../dbschema/edgeql-js";

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
