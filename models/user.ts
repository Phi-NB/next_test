import mongoose from "mongoose";
import { UserDoc } from "../interfaces/schema";
import { USER_ROLE } from "../interfaces/enum";

export const UserSchema = new mongoose.Schema<UserDoc>({
  _id: {
    type: String,
    required: true,
  },

  citizen_name: {
    type: String,
  },

  citizen_wallet: {
    type: String,
  },

  sub: {
    type: String,
  },

  username: {
    type: String,
  },

  email: {
    type: String,
  },

  given_name: {
    type: String,
  },

  family_name: {
    type: String,
  },

  email_verified: {
    type: Boolean,
  },

  roles: {
    type: [String],
    enum: Object.values(USER_ROLE),
  },

  last_login: {
    type: Date,
  },

  guest: {
    type: Number,
  },

  guest_token: {
    type: String,
  },

  created_at: {
    type: Date,
  },

  updated_at: {
    type: Date,
  },
});

UserSchema.set("versionKey", "version");
