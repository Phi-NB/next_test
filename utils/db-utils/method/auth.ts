import { isUndefined } from "lodash";
import {
  COLLECTION,
  DATABASE,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../../constraints/db";
import {
  ILoginAccountBody,
  IValidateAccountBody,
} from "../../../interfaces/auth/request";
import { IUserRole, USER_ROLE } from "../../../interfaces/enum";
import { validateAccessToken } from "../../auth";
import { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "mongoose";
import { UserSchema } from "../../../models/user";
import { StatusCodes } from "http-status-codes";
import { singleResponse } from "../../response";
import { connectDatabase, disconnectDatabase } from "..";
import {
  requestGetTokenByCode,
  requestGetTokenByRefreshToken,
  requestLogout,
} from "../../../services/auth";

export const validateAccount = async (
  body: IValidateAccountBody
): Promise<any> => {
  try {
    let roles: IUserRole[] = [USER_ROLE.USER];
    let account = null;
    const isUser = body.accessToken;
    let db: Connection;

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

    if (isUser) {
      const docs = await user.aggregate([
        { $match: { _id: account.activeCitizen?.saId } },
      ]);
      const doc = docs[0];

      if (!isUndefined(doc?.roles)) {
        roles = doc.roles;
      }
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

export const login = async (rep: NextApiRequest, res: NextApiResponse) => {
  const body = rep.body as ILoginAccountBody;
  let db: Connection;

  try {
    const tokenRes = await requestGetTokenByCode(body);

    if (tokenRes?.data?.message === "USER_NOT_WHITELIST_IN_THIS_BETA") {
      return res.status(500).json({
        status: false,
        message: MESSAGE_ERROR.USER_NOT_WHITELIST_IN_THIS_BETA,
      });
    }

    console.log(tokenRes.data.message);

    if (tokenRes.status !== 200 || !tokenRes.data?.data) {
      return res.status(500).json({
        status: false,
        message: MESSAGE_ERROR.VALIDATE_ACCOUNT,
      });
    }
    const accessToken = tokenRes.data?.data?.access_token;
    const account = await validateAccessToken(accessToken);

    db = await connectDatabase(DATABASE.AUTH);
    const user = db.models.users || db.model(COLLECTION.USER, UserSchema);

    let roles: IUserRole[] = [USER_ROLE.USER];
    try {
      const docs = await user.aggregate([
        { $match: { _id: account.activeCitizen?.saId } },
      ]);

      const doc = docs[0];

      if (!isUndefined(doc?.roles)) {
        roles = doc.roles;
      }
    } catch (error) {}

    return res.status(200).json({
      statusCode: StatusCodes.OK,
      message: MESSAGE_SUCCESS.LOGIN_ACCOUNT,
      data: tokenRes.data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: StatusCodes.FORBIDDEN,
      message: MESSAGE_ERROR.LOGIN,
    });
  }
};

export const refresh = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await requestGetTokenByRefreshToken(req.body);
    if (result?.data?.status !== "Success") {
      return res.status(500).json({
        status: false,
        message: MESSAGE_ERROR.VALIDATE_ACCOUNT,
      });
    }
    const accessToken = result.data?.data?.access_token;
    return res.status(500).json({
      status: false,
      statusCode: StatusCodes.OK,
      message: MESSAGE_SUCCESS.REFRESH_ACCOUNT,
      data: singleResponse({ access_token: accessToken }),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: MESSAGE_ERROR.REFRESH_ACCOUNT,
    });
  }
};

export const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await requestLogout(req.body);
    if (result?.data?.status !== "Success") {
      return res.status(500).json({
        status: false,
        message: MESSAGE_ERROR.VALIDATE_ACCOUNT,
      });
    }
    return res.status(500).json({
      status: false,
      statusCode: StatusCodes.OK,
      message: MESSAGE_SUCCESS.LOGOUT_ACCOUNT,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: MESSAGE_ERROR.LOGOUT_ACCOUNT,
    });
  }
};
