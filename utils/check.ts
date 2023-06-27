import { compact, isEmpty, isUndefined, toArray } from "lodash";
import mongoose, { Model } from "mongoose";
import { arrayToStringArray, removeDuplicate } from "./convert";
import { MESSAGE_ERROR } from "../constraints/db";

export const dataCheck = (data: any, convertData: any, defaultData?: any) => {
  if (isUndefined(data) || isEmptyObject(data)) {
    return defaultData || {};
  }
  return convertData;
};

export const isEmptyObject = (data: any) => {
  return typeof data === "object" && JSON.stringify(data) === "{}";
};

export const isObjectId = (id: string | number | mongoose.Types.ObjectId) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const checkObjectId = (
  id: string | number | mongoose.Types.ObjectId
) => {
  if (isObjectId(id)) {
    return new mongoose.Types.ObjectId(id);
  }

  return id;
};

export const checkJsonParse = (data: any) => {
  if (isEmpty(data) || isUndefined(data)) {
    return data;
  }
  return JSON.parse(data);
};

export const queryExistsObjectId = (arr: any[], additionalQuery: object) => {
  return {
    _id: { $in: arr.map((item) => checkObjectId(item)) },
    ...additionalQuery,
  };
};

export const checkExistsObjectId = async (
  model: Model<any, any, any, any, any>,
  arrayId: any,
  errorMessage: string,
  fullDoc = false,
  ignoreNotExists = false,
  additionalQuery = {}
): Promise<any[]> => {
  const arr = removeDuplicate(arrayToStringArray(compact(toArray(arrayId))));
  if (!isEmpty(arr)) {
    const query = queryExistsObjectId(arr, additionalQuery);
    if (fullDoc) {
      const exists = await model.find(query).exec();
      if (ignoreNotExists) {
        return exists;
      }
      if (arr.length !== exists.length) {
        throw Error(MESSAGE_ERROR.NOT_FOUND);
      }
      return exists;
    }
    const count = await model.count(query);
    if (ignoreNotExists) {
      return [count];
    }
    if (arr.length !== count) {
      throw Error(MESSAGE_ERROR.NOT_FOUND);
    }
    return [];
  }
  return [];
};
