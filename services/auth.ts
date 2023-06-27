import axios from "axios";
import {
  ILoginAccountBody,
  IRefreshAccountBody,
} from "../interfaces/auth/request";

export const requestGetTokenByCode = (params: ILoginAccountBody) => {
  const config = {
    method: "POST",
    url: `${process.env.AUTH_SERVER}/saas/api/v1/user/get-token-with-code`,
    data: params,
  };
  return axios(config);
};

export const requestGetTokenByRefreshToken = (params: IRefreshAccountBody) => {
  const config = {
    method: "POST",
    url: `${process.env.AUTH_SERVER}/saas/api/v1/user/get-token-with-refresh-token`,
    data: params,
  };
  return axios(config);
};

export const requestGetCurrentActiveCitizen = (params: {
  accessToken: string;
}) => {
  const config = {
    method: "GET",
    url: `${process.env.AUTH_SERVER}/saas/api/v1/citizen/get-current-citizen`,
    headers: {
      Authorization: "Bearer " + params.accessToken,
    },
  };
  return axios(config);
};

export const requestLogout = (params: IRefreshAccountBody) => {
  const config = {
    method: "POST",
    url: `${process.env.AUTH_SERVER}/saas/api/v1/user/logout`,
    data: params,
  };
  return axios(config);
};
