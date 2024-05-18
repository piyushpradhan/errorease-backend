import e, { createClient } from "../dbschema/edgeql-js";

const dbClient = createClient()

export const getUserDetails = async ({ uid }: { uid: string }) => {
  try {
    const userDetailsQuery = e.select(e.User, (user) => ({
      id: true,
      uid: true,
      displayName: true,
      username: true,
      email: true,
      labels: {
        ...e.Label["*"],
        owner: {
          ...e.User["*"]
        }
      },
      issues: {
        ...e.Issue["*"],
        owner: {
          ...e.User["*"]
        },
        links: {
          ...e.Link["*"]
        },
        labels: {
          ...e.Label["*"],
          owner: {
            ...e.User["*"],
          }
        }
      },
      filter_single: e.op(user.uid, "=", `${uid}`)
    }));

    const result = await userDetailsQuery.run(dbClient);

    return result || null;
  } catch (err) {
    return null;
  }
}
