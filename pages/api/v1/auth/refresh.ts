import type { NextApiRequest, NextApiResponse } from "next";
import { REQUEST_METHOD } from "../../../../constraints/db";
import { refresh } from "../../../../utils/db-utils/method/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (REQUEST_METHOD.POST) {
    return refresh(req, res);
  }
  return;
}
