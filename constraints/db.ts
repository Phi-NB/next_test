export const DB_URI = process.env.DB_URI;
export const DB_URI_PRODUCTION = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NETWORK}:${process.env.DB_PORT}/${process.env.DB_NAME}${process.env.DB_OPTION}`;

export enum COLLECTION {
  USER = "users",
  QUETS = "quests",
}

export enum REQUEST_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum MESSAGE_ERROR {
  CONNECT_ERROR_DB = "Connecting to database failed!",
  DEFAULT = "404",
  NOT_FOUND = "Not found!",
  NOT_FOUND_DATA_INPUT = "No insert data found!",
  GET_LIST_INFOR_USER = "Get list infor user failed.",
}

export enum MESSAGE_SUCCESS {
  GET_LIST_INFOR_USER = "Get list infor user successfuly.",
}
