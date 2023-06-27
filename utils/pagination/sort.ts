import { snakeCase } from "lodash";
import { ISort } from "../../interfaces/paging";

export const commonSort = ({ sort }: { sort: ISort[] }) => {
  let querySort = {};
  if (sort && sort.length > 0) {
    const obj = {} as any;
    sort.forEach((item: any) => {
      const attribute = snakeCase(item?.key);
      if (!obj[`${attribute}`]) {
        obj[`${attribute}`] = item?.direction;
      }
    });
    querySort = { ...querySort, ...obj };
  }
  return querySort;
};
