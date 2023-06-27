import mongoose from "mongoose";
import {
  camelCase,
  isArray,
  isObject,
  cloneDeep,
  map,
  mapKeys,
  mapValues,
  isPlainObject,
} from "lodash";

export const camelize = (obj: any): any => {
  let objectCheck = obj;
  if (mongoose.Types.ObjectId.isValid(objectCheck)) {
    objectCheck = obj.toString();
  }
  if (!isObject(objectCheck)) {
    return objectCheck;
  }
  let object = cloneDeep(objectCheck);
  if (isArray(object)) {
    return map(object, camelize);
  } else {
    object = mapKeys(object, (value: any, key: any) => {
      return camelCase(key);
    });
    return mapValues(object, (value: any) => {
      if (isPlainObject(value)) {
        return camelize(value);
      } else if (isArray(value)) {
        return map(value, camelize);
      } else {
        return value;
      }
    });
  }
};
