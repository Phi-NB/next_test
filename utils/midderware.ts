import { NextApiRequest, NextApiResponse } from "next";
import { MESSAGE_ERROR } from "../constraints/db";
import { validateAccount } from "./db-utils/method/auth";
import { StatusCodes } from "http-status-codes";
import { IUserRole } from "../interfaces/enum";
import { IResponseValidateAccount } from "../interfaces/auth/response";
import { checkRoleAccount } from "./check";

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

    // console.log(response?.data?.data);

    if (response.statusCode !== StatusCodes.OK) {
      res.status(500).json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: response?.message || MESSAGE_ERROR.USER_CREDENTIALS_INVALID,
        errors: response?.errors || [],
      });
    }

    return {
      status: true,
      currentAccount: response?.data?.data,
    } as IResponseValidateAccount;
  } else {
    return res
      .status(500)
      .json({ message: MESSAGE_ERROR.TOKEN_INVALID, status: false });
  }
};

export const middlewareCheckRole = (
  res: NextApiResponse,
  roles: IUserRole[],
  rolesDesire: IUserRole[]
) => {
  const roleValid = checkRoleAccount(roles, rolesDesire);
  if (roleValid.length === 0) {
    res
      .status(500)
      .json({ message: MESSAGE_ERROR.ROLE_INVALID, status: false });
  }
  return roleValid;
};
