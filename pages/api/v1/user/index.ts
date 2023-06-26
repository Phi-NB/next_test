import type { NextApiRequest, NextApiResponse } from "next";
import { REQUEST_METHOD } from "../../../../constraints/db";
import { getListInforUser } from "../../../../utils/db-utils/method/user";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (REQUEST_METHOD.POST) {
    return getListInforUser(req, res);
  }

  return;
}
