import { Context } from "@oak/oak";

export default function (
  ctx: Context,
  status: number,
  message: { [any: string]: unknown },
): void {
  ctx.response.status = status;
  ctx.response.type = "application/json";
  ctx.response.body = {
    status: status,
    ...message,
  };
}
