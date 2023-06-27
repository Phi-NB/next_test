export interface IValidateAccountBody {
  accessToken: string;
}

export interface ILoginAccountBody {
  clientId: string;
  code: string;
  redirectUrl: string;
}

export interface IRefreshAccountBody {
  clientId: string;
  refreshToken: string;
}
