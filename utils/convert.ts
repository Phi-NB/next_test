import { isArray, isUndefined, isEmpty } from "lodash";

export const arrayToStringArray = (arr: any[]) => {
  return arr.map((item) => String(item).toLowerCase());
};

export const removeDuplicate = (arr: any[]) => {
  return [...new Set(arr)];
};

export const toArray = (data: any) => {
  if (!isArray(data) && (!isUndefined(data) || !isEmpty(data))) {
    return [data];
  }
  if (isArray(data)) {
    return data;
  }
  return [];
};
