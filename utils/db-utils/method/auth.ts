import { isUndefined } from "lodash";
import {
  COLLECTION,
  DATABASE,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../../constraints/db";
import { IValidateAccountBody } from "../../../interfaces/auth/request";
import { IUserRole, USER_ROLE } from "../../../interfaces/enum";
import { IAccountCitizen, IAccountInfo, validateAccessToken } from "../../auth";
import { checkExistsObjectId, dataCheck } from "../../check";
import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "mongoose";
import { UserSchema } from "../../../models/user";
import { checkUserDataNeedUpdate, createSendData } from "../../user";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { singleResponse } from "../../response";
import { connectDatabase, disconnectDatabase } from "..";

export const validateAccount = async (
  body: IValidateAccountBody
): Promise<any> => {
  try {
    let roles: IUserRole[] = [USER_ROLE.USER];
    let account = null;
    let doc: any;
    const isUser = body.accessToken;
    let db: Connection;

    let userDoc = null;
    if (isUser) {
      try {
        account = await validateAccessToken(body.accessToken);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    db = await connectDatabase(DATABASE.AUTH);

    const user = db.models.users || db.model(COLLECTION.USER, UserSchema);

    if (!account) {
      throw new Error(MESSAGE_ERROR.VALIDATE_ACCOUNT);
    }

    // const sendData = createSendData(account);

    if (isUser) {
      try {
        const docs = await user.aggregate([
          { $match: { _id: account.activeCitizen?.saId } },
        ]);
        const doc = docs[0];

        if (!isUndefined(doc?.roles)) {
          roles = doc.roles;
        }
      } catch (error) {}
    }

    if (!account) {
      throw new Error(MESSAGE_ERROR.VALIDATE_ACCOUNT);
    }

    await disconnectDatabase(db);

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
