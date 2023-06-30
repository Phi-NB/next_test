import { IUserRole } from "../enum";
import { UserDoc } from "../schema";
export interface IActiveCitizen {
  saId: string;
  citizenCode: string;
  userId: string;
  name: string;
  wallet: string;
  level: number;
  status: number;
  createdAt: number;
  updatedAt: number;
  listTopicName: any[];
  score: number;
  isBlocked: number;
  avatarUrl: string;
  refLevel: number;
}

export interface IAccount {
  account: UserDoc;
  activeCitizen: IActiveCitizen;
  roles: IUserRole[];
}

export interface IResponseValidateAccount {
  status: boolean;
  currentAccount: IAccount;
}
