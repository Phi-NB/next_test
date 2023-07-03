import type { NextApiRequest, NextApiResponse } from "next";
import { REQUEST_METHOD } from "../../../../constraints/db";
import { getListInforCitizenUser } from "../../../../utils/db-utils/method/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (REQUEST_METHOD.POST) {
    return getListInforCitizenUser(req, res);
  }
  return;
}
