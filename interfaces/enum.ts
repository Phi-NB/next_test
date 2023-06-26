export enum USER_ROLE {
  ROOT_ADMIN = "ROOT_ADMIN",
  ROOT_REVIEWER = "ROOT_REVIEWER",
  ROOT_TESTER = "ROOT_TESTER",
  USER = "USER",
  PUBLISHER = "PUBLISHER",
  GUEST = "GUEST",
}
export type IUserRole = `${USER_ROLE}`;

export enum TYPE_CHART {
  SEVENT_DAY_AGO = "1",
  MOUNTH_DAY_AGO = "2",
  YEAR_DAY_AGO = "3",
}
export type ITypeChart = `${TYPE_CHART}`;
