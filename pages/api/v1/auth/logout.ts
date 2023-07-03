import type { NextApiRequest, NextApiResponse } from "next";
import { REQUEST_METHOD } from "../../../../constraints/db";
import { logout } from "../../../../utils/db-utils/method/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (REQUEST_METHOD.POST) {
    return logout(req, res);
  }
  return;
}
