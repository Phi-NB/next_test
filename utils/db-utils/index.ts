import mongoose from "mongoose";
import { DB_URI, DB_URI_PRODUCTION } from "../../constraints/db";

export const connectDatabase = async () => {
  const connectURI =
    process.env.NODE_ENV === "production" ? DB_URI_PRODUCTION : DB_URI;
  await mongoose.connect(connectURI);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
