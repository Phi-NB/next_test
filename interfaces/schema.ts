import { IUserRole } from "./enum";

export interface UserDoc {
  _id: string;
  citizen_name: string;
  citizen_wallet: string;
  sub: string;
  username: string;
  email: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  roles: IUserRole[];
  point: number;
  first_login: Date;
  last_login: Date;
  social: any;
  guest?: number;
  guest_token?: string;
  created_at: Date;
  updated_at: Date;
}
