import e from "../dbschema/edgeql-js";
import dotenv from "dotenv";
import createClient from "edgedb";

dotenv.config();

const dbClient = createClient({
  instanceName: process.env.EDGEDB_INSTANCE,
  secretKey: process.env.EDGEDB_SECRET_KEY
});

export const getAllLabels = async ({ uid }: { uid: string }) => {
  const query = e.select(e.Label, (label) => ({
    ...e.Label["*"],
    issue: {
      ...e.Issue["*"]
    },
    owner: {
      ...e.User["*"]
    },
    filter: e.op(label.owner.uid, "=", `${uid}`)
  }));

  const labels = await query.run(dbClient);

  return labels || [];
}

