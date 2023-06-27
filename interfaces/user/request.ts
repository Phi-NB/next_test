import { TYPE_CHART } from "../enum";
import { IPaginationBodyReq } from "../paging";

export interface IRequestGetDataUserBody {
  type: TYPE_CHART;
}

export interface ICitizenInfor {
  name: string;
  id: string;
}

export interface IGetListCitizenInfor extends IPaginationBodyReq {
  search: ICitizenInfor;
}
