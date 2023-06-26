import { NextApiRequest, NextApiResponse } from "next";
import {
  COLLECTION,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../../constraints/db";
import { connectDatabase, disconnectDatabase } from "../index";
import mongoose from "mongoose";
import { UserSchema } from "../../../models/user";

export const getListInforUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: MESSAGE_ERROR.CONNECT_ERROR_DB });
    return;
  }

  try {
    const user =
      mongoose.models.users || mongoose.model(COLLECTION.USER, UserSchema);

    // const totalUsers = await user.aggregate([
    //   { $match: { email: { $ne: null } } },
    //   { $group: { _id: "$email" } },
    //   { $group: { _id: null, count: { $sum: 1 } } },
    // ]);
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setUTCDate(
      currentDate.getUTCDate() - ((currentDate.getUTCDay() + 6) % 7)
    ); // Đặt ngày thành ngày đầu tuần
    // console.log(startOfWeek, currentDate);

    const dates = [];
    const currentDateCopy = new Date(startOfWeek);
    while (currentDateCopy <= currentDate) {
      dates.push(new Date(currentDateCopy).getDate());
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    const totalUsers = await user.aggregate([
      {
        $match: {
          email: { $ne: null },
          created_at: { $gte: startOfWeek, $lte: currentDate },
        },
      },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$created_at" },
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1, // Sắp xếp theo ngày trong tuần tăng dần
        },
      },
    ]);

    // console.log(totalUsers);

    console.log(dates);

    const totalCitizenUsers = await user.aggregate([
      {
        $group: {
          _id: "$email",
          citizen: { $sum: 1 },
        },
      },
    ]);

    await disconnectDatabase();

    return res.status(200).json({
      // message: MESSAGE_SUCCESS.GET_LIST_INFOR_USER,
      // totalUser: totalUsers[0].count,
      // totalCitizenUsers: totalCitizenUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGE_ERROR.GET_LIST_INFOR_USER });
  }
};
