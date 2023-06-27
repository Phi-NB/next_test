import { IGetListCitizenInfor } from "../../interfaces/user/request";
import { dataCheck } from "../check";

export const searchDeck = ({ search }: IGetListCitizenInfor) => {
  let querySearch = {};
  if (search) {
    querySearch = {
      ...dataCheck(search.name, {
        name: { $regex: search.name.toLowerCase(), $options: "i" },
      }),
    };
  }
  return querySearch;
};
