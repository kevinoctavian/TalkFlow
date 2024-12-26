import { RouterContext } from "@oak/oak";
import { ErrorPacketParams, RowDataPacket } from "mysql2";

import jsonMessage from "../utils/jsonMessage.ts";
import db from "../database/db.ts";

type UserParams = {
  id: string;
};

class UserController {
  public static async getUser(ctx: RouterContext<"/api/user/:id", UserParams>) {
    const { id } = ctx.params;

    try {
      const [results] = await db.query<RowDataPacket[]>(
        "SELECT id, username, email, avatar, about_me FROM users WHERE id = ? LIMIT 20",
        [id],
      );

      jsonMessage(ctx, 200, { data: results.at(0) ?? {} });
    } catch (error) {
      jsonMessage(ctx, 500, {
        msg: "Server error or user not found",
        error: (error as ErrorPacketParams).message,
      });
    }
  }
}

export default UserController;
