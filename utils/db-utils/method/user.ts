import { NextApiRequest, NextApiResponse } from "next";
import {
  COLLECTION,
  DATABASE,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../../constraints/db";
import { connectDatabase, disconnectDatabase } from "../index";
import { Connection } from "mongoose";
import { UserSchema } from "../../../models/user";
import { TYPE_CHART, USER_ROLE } from "../../../interfaces/enum";
import Joi from "joi";
import { IRequestGetDataUserBody } from "../../../interfaces/user/request";
import { middlewareAuth, middlewareCheckRole } from "../../midderware";
import { IResponseValidateAccount } from "../../../interfaces/auth/response";

export const getListInforUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let db: Connection;
  const body = req.body as IRequestGetDataUserBody;
  const arrayTypes = Object.values(TYPE_CHART).reduce(
    (acc: any[], curr, index, arr) => {
      acc.push(curr);
      return acc;
    },
    []
  );
  let responseValidateAccount: IResponseValidateAccount | void;

  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(arrayTypes))
      .required(),
  });

  try {
    await schema.validateAsync(body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGE_ERROR.VALIDATE, error: error });
  }

  try {
    db = await connectDatabase(DATABASE.AUTH);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGE_ERROR.CONNECT_ERROR_DB });
    return;
  }

  try {
    responseValidateAccount = await middlewareAuth(req, res);
  } catch (error) {
    res.status(500).json({ message: MESSAGE_ERROR.VALIDATE, status: false });
  }

  // console.log(responseValidateAccount);

  try {
    if (responseValidateAccount instanceof Object) {
      if (responseValidateAccount.status) {
        const role = middlewareCheckRole(
          res,
          responseValidateAccount.currentAccount.roles,
          [USER_ROLE.ROOT_ADMIN]
        );
      }
    } else {
      res
        .status(500)
        .json({ message: MESSAGE_ERROR.ROLE_INVALID, status: false });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGE_ERROR.ROLE_INVALID, status: false });
  }

  try {
    const user = db.models.users || db.model(COLLECTION.USER, UserSchema);

    const totalAccount = await user.aggregate([
      { $match: { email: { $ne: null } } },
      { $group: { _id: "$email" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const startDate = new Date(currentDate);

    switch (body.type) {
      case TYPE_CHART.SEVENT_DAY_AGO: {
        startDate.setUTCDate(
          currentDate.getUTCDate() - (currentDate.getUTCDay() + 6)
        );
        break;
      }
      case TYPE_CHART.MOUNTH_DAY_AGO: {
        startDate.setUTCMonth(startDate.getUTCMonth() - 1);
        break;
      }
      case TYPE_CHART.YEAR_DAY_AGO: {
        startDate.setUTCMonth(startDate.getUTCMonth() - 12);
        break;
      }
      default: {
        startDate.setUTCDate(
          currentDate.getUTCDate() - (currentDate.getUTCDay() + 6)
        );
      }
    }

    const totalUsers = await user.aggregate([
      {
        $match: {
          email: { $ne: null },
          created_at: { $gte: startDate, $lt: currentDate },
        },
      },
      {
        $group: {
          _id:
            body.type === TYPE_CHART.YEAR_DAY_AGO
              ? { $dateToString: { format: "%Y-%m", date: "$created_at" } }
              : { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const listAmountVector = [];
    const listTimeVector = [];

    totalUsers.reduce((accumulator, current) => {
      listAmountVector.push(accumulator + current.count);
      switch (body.type) {
        case TYPE_CHART.SEVENT_DAY_AGO: {
          const time = new Date(current._id).getDate();
          listTimeVector.push(time);
          break;
        }
        case TYPE_CHART.MOUNTH_DAY_AGO: {
          const time = new Date(current._id).getDate();
          listTimeVector.push(time);
          break;
        }
        case TYPE_CHART.YEAR_DAY_AGO: {
          const time = new Date(current._id).getMonth() + 1;
          listTimeVector.push(time);
          break;
        }
        default: {
          const time = new Date(current._id).getDate();
          listTimeVector.push(time);
          break;
        }
      }

      return accumulator + current.count;
    }, 0);

    try {
      await disconnectDatabase(db);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: MESSAGE_ERROR.DISCONNECT_ERROR_DB });
      return;
    }

    return res.status(200).json({
      message: MESSAGE_SUCCESS.GET_LIST_INFOR_USER,
      totalUser: totalAccount[0].count,
      listAmountVector: listAmountVector,
      listTimeVector: listTimeVector,
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGE_ERROR.GET_LIST_INFOR_USER });
  }
};

export const getListInforCitizenUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let db: Connection;
  try {
    try {
      db = await connectDatabase(DATABASE.USER_STATIC);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: MESSAGE_ERROR.CONNECT_ERROR_DB });
      return;
    }

    try {
      await disconnectDatabase(db);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: MESSAGE_ERROR.DISCONNECT_ERROR_DB });
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: MESSAGE_ERROR.GET_LIST_INFOR_CITIZEN_USER });
  }
};
