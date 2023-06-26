import mongoose, { ConnectOptions } from "mongoose";
import { DB_URI, DB_URI_PRODUCTION } from "../../constraints/db";

export const connectDatabase = async () => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;
  const connectURI =
    process.env.NODE_ENV === "production" ? DB_URI_PRODUCTION : DB_URI;
  await mongoose.connect(connectURI, option);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
