export interface RealmAccess {
  roles: string[];
}

export interface Account {
  roles: any[];
}

export interface ResourceAccess {
  account: Account;
}

export interface IAccount {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface ICurrentCitizen {
  id: string;
  saId: string;
  citizenCode: string;
  userId: string;
  name: string;
  wallet: string;
  level: number;
  status: number;
  createdAt: number;
  updatedAt: number;
  listTopicName: any[];
  score: number;
  isBlocked: number;
  roles: any;
  avatarUrl: string;
  refLevel: number;
}
