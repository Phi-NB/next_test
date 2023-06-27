import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MESSAGE_ERROR } from "../constraints/db";
import { validateAccount } from "./db-utils/method/auth";
import { assign } from "lodash";
import { StatusCodes } from "http-status-codes";

export const middlewareAuth = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const authorization: string = req.headers["authorization"];
  if (
    authorization &&
    typeof authorization === "string" &&
    authorization !== ""
  ) {
    const bearer: string[] = authorization.split(" ");
    if (!bearer || bearer.length < 2) {
      return res
        .status(500)
        .json({ message: MESSAGE_ERROR.USER_CREDENTIALS_NOT_FOUND });
    }

    const token: string = bearer[1];

    const response = await validateAccount({ accessToken: token });

    if (response.statusCode !== StatusCodes.OK) {
      res.status(500).json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: response?.message || MESSAGE_ERROR.USER_CREDENTIALS_INVALID,
        errors: response?.errors || [],
      });
    }

    return assign(req, {
      currentAccount: response?.data?.data,
      responseData: response,
    });
  } else {
    return res
      .status(500)
      .json({ message: MESSAGE_ERROR.TOKEN_INVALID, status: false });
  }
};

export const middlewareCheckRole = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};
