import mongoose from "mongoose";

export async function connection() {
  const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER } = process.env;
  const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net`;

  await mongoose.connect(uri);
}
