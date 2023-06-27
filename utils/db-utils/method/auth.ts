import { isUndefined } from "lodash";
import {
  COLLECTION,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../../constraints/db";
import { IValidateAccountBody } from "../../../interfaces/auth/request";
import { IUserRole, USER_ROLE } from "../../../interfaces/enum";
import { IAccountCitizen, IAccountInfo, validateAccessToken } from "../../auth";
import { checkExistsObjectId, dataCheck } from "../../check";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { UserSchema } from "../../../models/user";
import { checkUserDataNeedUpdate, createSendData } from "../../user";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { singleResponse } from "../../response";

export const validateAccount = async (
  body: IValidateAccountBody,
  req?: NextApiRequest,
  res?: NextApiResponse
): Promise<any> => {
  try {
    let roles: IUserRole[] = [USER_ROLE.USER];
    let account = null;
    const isUser = body.accessToken;

    let userDoc = null;
    if (isUser) {
      try {
        account = await validateAccessToken(body.accessToken);
      } catch (error) {
        console.log(error);
      }
    }

    const modelUser =
      mongoose.models.users || mongoose.model(COLLECTION.USER, UserSchema);

    if (!account) {
      throw new Error(MESSAGE_ERROR.VALIDATE_ACCOUNT);
    }

    const sendData = createSendData(account);

    console.log("dfjlaskjdflksajdlfkasjdlfj", sendData);

    if (isUser) {
      try {
        const docs = await checkExistsObjectId(
          modelUser,
          sendData.id,
          MESSAGE_ERROR.NOT_FOUND_USER,
          true
        );

        const doc = docs[0];
        if (!isUndefined(doc?.roles)) {
          userDoc = doc.toJSON();
          roles = doc.roles;
          if (checkUserDataNeedUpdate(sendData, doc?.toObject())) {
            await modelUser.updateOne(
              { _id: sendData.id },
              { $set: sendData },
              { upsert: true }
            );
          }
        }
      } catch (error) {}
    }

    if (userDoc !== null) {
      if (
        !dayjs(userDoc?.last_login).isSame(dayjs(), "day") ||
        isUndefined(userDoc?.last_login)
      ) {
        const eventValue = {
          id: sendData.id,
          last_login: new Date(),
          version: userDoc.version + 1,
        };
        await modelUser.updateOne(
          { _id: sendData.id },
          { $set: eventValue },
          { upsert: true }
        );
      }
    }

    return {
      statusCode: StatusCodes.OK,
      message: MESSAGE_SUCCESS.VALIDATE_ACCOUNT,
      data: singleResponse({ ...account, roles }),
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      message: MESSAGE_ERROR.VALIDATE_ACCOUNT,
    };
  }
};
