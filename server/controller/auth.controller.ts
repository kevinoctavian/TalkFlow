import { Context } from "@oak/oak";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import * as bcrypt from "@felix/bcrypt";
import { decode as decodeJWT } from "@zaubrik/djwt";

import db from "../database/db.ts";
import jsonMessage from "../utils/jsonMessage.ts";
import { snowflakeGen } from "../utils/snowflake.ts";
import { signJwt } from "../utils/jwt.ts";
import { UserModel } from "../models/user.model.ts";
import { convertDate2Timestamp } from "../utils/convertDate2Timestamp.ts";

const ACCESS_TOKEN_EXPIRES_IN = 15;
const REFRESH_TOKEN_EXPIRES_IN = 60;

class AuthController {
  public static async register(ctx: Context) {
    const form = await ctx.request.body.formData();

    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password")!;
    const confirm_password = form.get("confirm_password");

    if (password != confirm_password) {
      jsonMessage(ctx, 203, { msg: "Password not match" });
      return;
    }

    // checking if user already exists
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT username, email FROM users WHERE username = ? OR email = ?",
      [username, email],
    );

    if (results.length > 0) {
      // send if email is taken
      if (results.some((x) => x.email === email && x.username !== username)) {
        jsonMessage(ctx, 400, { msg: "Email already taken!" });
        return;
      }

      // send if username is taken
      if (results.some((x) => x.email !== email && x.username === username)) {
        jsonMessage(ctx, 400, { msg: "Username already taken!" });
        return;
      }

      // send if email and username is taken;
      if (results.some((x) => x.email === email && x.username === username)) {
        jsonMessage(ctx, 400, { msg: "Email and Username already taken!" });
        return;
      }
    }

    // create new user
    try {
      const hashPassword = await bcrypt.hash(password.toString());
      await db.query<ResultSetHeader>(
        "INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)",
        [snowflakeGen.nextId(), username, email, hashPassword],
      );

      jsonMessage(ctx, 201, { msg: "Success create user" });
    } catch (error) {
      jsonMessage(ctx, 500, {
        error,
        msg: "Can't create new user, please try again",
      });
    }
  }

  public static async login(ctx: Context) {
    const form = await ctx.request.body.formData();

    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password")!;

    if (username === null && email === null) {
      jsonMessage(ctx, 400, { msg: "username/email is empty" });
      return;
    }

    // make sure when user exploit the username/email form
    let query =
      "SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?";
    if (username !== null && email !== null) {
      query = query.replace("OR", "AND");
    }

    const [userRows] = await db.query<UserModel[]>(
      query,
      [username, email],
    );

    if (userRows.length <= 0) {
      jsonMessage(ctx, 400, {
        msg: "username/email and password wrong please try again",
      });
      return;
    }

    const passwordVerify = await bcrypt.verify(
      password.toString(),
      userRows[0].password_hash,
    );

    if (!passwordVerify) {
      jsonMessage(ctx, 400, { msg: "Wrong password!" });
      return;
    }

    const accessTokenExpired = new Date(
      Date.now() + ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
    );
    const refreshTokenExpired = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
    );

    const [tokenRow] = await db.query<RowDataPacket[]>(
      "SELECT id, token, expired_at FROM refresh_tokens WHERE user_id = ?",
      [userRows[0].id],
    );

    const accessToken = await signJwt({
      user_id: userRows[0].id.toString(),
      base64PrivateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY",
      expiresIn: accessTokenExpired,
      issuer: "localhost:5173",
      token_id: tokenRow.length
        ? tokenRow[0].id
        : snowflakeGen.nextId().toString(),
    });
    const refreshToken = await signJwt({
      user_id: userRows[0].id.toString(),
      base64PrivateKeyPem: "REFRESH_TOKEN_PRIVATE_KEY",
      expiresIn: refreshTokenExpired,
      issuer: "localhost:5173",
      token_id: tokenRow.length
        ? tokenRow[0].id
        : snowflakeGen.nextId().toString(),
    });

    try {
      if (tokenRow.length) {
        await db.query(
          "UPDATE refresh_tokens SET token = ?, expired_at = ? WHERE id = ?",
          [
            refreshToken.token,
            convertDate2Timestamp(refreshTokenExpired),
            tokenRow[0].id,
          ],
        );
      } else {
        await db.query(
          "INSERT INTO refresh_tokens (id, user_id, token, device_name, expired_at) VALUES (?, ?, ?, ?, ?)",
          [
            refreshToken.token_id,
            userRows[0].id,
            refreshToken.token,
            ctx.request.ip,
            convertDate2Timestamp(refreshTokenExpired),
          ],
        );
      }
    } catch (_error) {
      jsonMessage(ctx, 500, { msg: "failed to insert data" });
      return;
    }

    await ctx.cookies.set("refresh_token", refreshToken.token, {
      httpOnly: true,
      maxAge: 60 * 60,
      expires: refreshTokenExpired,
      secure: false,
    });

    jsonMessage(ctx, 200, {
      data: { access_token: accessToken, refresh_token: refreshToken },
    });
  }

  public static async logout(ctx: Context) {
    const refreshToken = await ctx.cookies.get("refresh_token");
    if (!refreshToken) {
      jsonMessage(ctx, 401, { msg: "refresh token invalid" });
      return;
    }

    try {
      await ctx.cookies.delete("refresh_token");

      const [_header, payload, _uint8] = decodeJWT(refreshToken) as [
        unknown,
        { [payload: string]: unknown },
        Uint8Array,
      ];

      await db.execute("DELETE FROM refresh_tokens WHERE id = ?", [
        payload.token_id,
      ]);
      jsonMessage(ctx, 200, {
        msg: "Deleting refresh token successful",
      });
    } catch (_) {
      console.log(_);
      jsonMessage(ctx, 500, { msg: "Failed delete refresh token" });
    }
  }

  public static refreshToken(_: Context) {}
}

export default AuthController;
