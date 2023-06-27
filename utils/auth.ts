import { pick } from "lodash";
import { IAccount, ICurrentCitizen } from "../interfaces/auth";
import { verifyTokenWithJson, verifyTokenWithJwks } from "./jwt";
import { MESSAGE_ERROR } from "../constraints/db";
import { requestGetCurrentActiveCitizen } from "../services/auth";

export interface IAccountInfo {
  sub: string;
  name: string;
  username: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
}

export interface IAccountCitizen {
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

export const validateAccessToken = async (accessToken: string) => {
  let account: IAccount;
  try {
    account = (await verifyTokenWithJson(accessToken)) as IAccount;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error(MESSAGE_ERROR.TOKEN_EXPIRED);
    }
  }
  let citizen: ICurrentCitizen;
  try {
    citizen = (await getActiveCitizen(accessToken)) as ICurrentCitizen;
  } catch (error) {
    throw new Error(MESSAGE_ERROR.INVALID_CITIZEN_ACTIVE);
  }
  const response = {
    account: convertAccountInfo(account) as IAccountInfo,
    activeCitizen: convertCitizenInfo(citizen) as IAccountCitizen,
  };
  return response;
};

export const getActiveCitizen = async (accessToken: string) => {
  const response = await requestGetCurrentActiveCitizen({ accessToken });
  if (response.status !== 200 || !response.data?.data) {
    throw new Error(MESSAGE_ERROR.EXPECTATION_FAILED);
  }
  const citizen = response.data?.data;
  return citizen;
};

export const convertAccountInfo = (account: IAccount) => {
  return pick({ ...account, username: account.preferred_username }, [
    "sub",
    "name",
    "username",
    "given_name",
    "family_name",
    "email",
    "email_verified",
  ]);
};

export const convertCitizenInfo = (citizen: ICurrentCitizen) => {
  return pick(citizen, [
    "saId",
    "citizenCode",
    "userId",
    "name",
    "wallet",
    "level",
    "status",
    "createdAt",
    "updatedAt",
    "listTopicName",
    "score",
    "isBlocked",
    "avatarUrl",
    "refLevel",
  ]);
};
