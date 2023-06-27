import { omit } from "lodash";
import { camelize } from "./case";

export const formatResponse = (data: any) => {
  return camelize(omit(JSON.parse(JSON.stringify(data)), ["version"]));
};

export const singleResponse = (data: any) => {
  return { data: formatResponse(data) };
};

export const listResponse = (props: {
  currentPage: number;
  perPage: number;
  pageCount: number;
  count: number;
  data: any;
}) => {
  const { currentPage, perPage, pageCount, data, count } = props;
  return {
    currentPage: currentPage,
    perPage: perPage,
    totalPage: pageCount,
    totalResult: count,
    data: data,
  };
};
