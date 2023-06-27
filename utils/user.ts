import { isEqual } from "lodash";
import { DeepPartial } from "../interfaces";
import { UserDoc } from "../interfaces/schema";
import { IAccountCitizen, IAccountInfo } from "./auth";
import { dataCheck } from "./check";

export const checkUserDataNeedUpdate = (
  newData: DeepPartial<UserDoc>,
  oldData: DeepPartial<UserDoc>
) => {
  let result = false;
  for (const attr in newData) {
    if (attr in oldData) {
      if (!isEqual((newData as any)[attr], (oldData as any)[attr])) {
        console.log(
          "checkUserDataNeedUpdate",
          (newData as any)[attr],
          (oldData as any)[attr]
        );
        result = true;
        break;
      }
    }
  }
  return result;
};

export const createSendData = (account: {
  account: IAccountInfo;
  activeCitizen: IAccountCitizen;
}) => {
  try {
    const sendData = {
      id: account.activeCitizen?.saId,
      sub: account.account?.sub,
      username: account.account?.username,
      email: account.account?.email,
      given_name: account.account?.given_name,
      family_name: account.account?.family_name,
      email_verified: account.account?.email_verified,
      ...dataCheck(account.activeCitizen?.avatarUrl, {
        avatar_url: account.activeCitizen?.avatarUrl,
      }),
      citizen_name: account.activeCitizen?.name || "",
      ...dataCheck(account.activeCitizen?.wallet, {
        citizen_wallet: account.activeCitizen?.wallet,
      }),
      ...dataCheck(account.activeCitizen?.citizenCode, {
        citizen_code: account.activeCitizen?.citizenCode,
      }),
      ...dataCheck(account.activeCitizen?.level, {
        citizen_level: account.activeCitizen?.level,
      }),
      ...dataCheck(account.activeCitizen?.status, {
        citizen_status: account.activeCitizen?.status,
      }),
      ...dataCheck(account.activeCitizen?.score, {
        citizen_score: account.activeCitizen?.score,
      }),
      ...dataCheck(account.activeCitizen?.isBlocked, {
        citizen_is_blocked: account.activeCitizen?.isBlocked,
      }),
      ...dataCheck(account.activeCitizen?.refLevel, {
        citizen_ref_level: account.activeCitizen?.refLevel,
      }),
      ...dataCheck(account.activeCitizen?.listTopicName, {
        citizen_list_topic_name: account.activeCitizen?.listTopicName,
      }),
    };

    return sendData;
  } catch (error) {
    console.log(error);
  }
};
