import mongoose, { ConnectOptions, Connection } from "mongoose";
import { DATABASE, DB_URI, DB_URI_PRODUCTION } from "../../constraints/db";

export const connectDatabase = async (nameDatabase: DATABASE) => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;

  const connectURI =
    process.env.NODE_ENV === "production" ? DB_URI_PRODUCTION : DB_URI;
  const connect = await mongoose
    .createConnection(connectURI, option)
    .asPromise();
  const db = connect.useDb(nameDatabase);
  return db;
};

export const disconnectDatabase = async (db: Connection) => {
  await db.close();
};
