export const DB_URI = process.env.DB_URI;
export const DB_URI_PRODUCTION = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NETWORK}:${process.env.DB_PORT}/${process.env.DB_NAME}${process.env.DB_OPTION}`;

export enum DATABASE {
  AUTH = "auth",
  USER_STATIC = "user-static",
}

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
  DISCONNECT_ERROR_DB = "Connecting to database failed!",
  DEFAULT = "404",
  NOT_FOUND = "Not found!",
  NOT_FOUND_DATA_INPUT = "No insert data found!",
  GET_LIST_INFOR_USER = "Get list infor user failed.",
  VALIDATE = "Error validate",
  GET_LIST_INFOR_CITIZEN_USER = "Get list infor citizen users",
  USER_CREDENTIALS_NOT_FOUND = "User credentials not found.",
  TOKEN_EXPIRED = "Token expired.",
  INVALID_CITIZEN_ACTIVE = "Invalid active citizen.",
  VALIDATE_ACCOUNT = "Invalid credentials.",
  NOT_FOUND_USER = "Not found user!",
  EXPECTATION_FAILED = "Expectation Failed",
  USER_CREDENTIALS_INVALID = "User credentials are invalid.",
  TOKEN_INVALID = "Token invalid",
  ROLE_INVALID = "Role invalid",
  USER_NOT_WHITELIST_IN_THIS_BETA = "User not whitelist in this beta.",
  LOGIN = "Login failed!",
  REFRESH_ACCOUNT = "Get new access token failed.",
  LOGOUT_ACCOUNT = "Logout failed.",
}

export enum MESSAGE_SUCCESS {
  GET_LIST_INFOR_USER = "Get list infor user successfuly.",
  GET_LIST_INFOR_CITIZEN_USER = "Get list infor user successfuly.",
  VALIDATE_ACCOUNT = "Validate account successfully.",
  LOGOUT_ACCOUNT = "Logout successfully.",
  REFRESH_ACCOUNT = "Get new access token successfully.",
  LOGIN_ACCOUNT = "Login successfully.",
}

export enum TYPE_FILTER {}
