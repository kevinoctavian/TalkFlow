import { Context } from "@oak/oak";
import jsonMessage from "../utils/jsonMessage.ts";
import { verifyJwt } from "../utils/jwt.ts";

interface GatewayMessageData {
  event: string;
  data: { [data: string]: unknown };
}

class GatewayController {
  // private connection: Map<string, Set<WebSocket>> = new Map();

  constructor() {
    this.ConnectWS = this.ConnectWS.bind(this);
  }

  public async ConnectWS(ctx: Context) {
    if (!ctx.isUpgradable) {
      ctx.response.status = 501;
      ctx.response.type = "application/json";
      ctx.response.body = JSON.stringify({
        status: ctx.response.status,
        message: "501 not supported",
      });
      return;
    }

    const token = ctx.request.url.searchParams.get("token");
    if (!token) {
      ctx.response.status = 401;
      ctx.response.type = "application/json";
      ctx.response.body = JSON.stringify({
        status: ctx.response.status,
        message: "401 unauthorization",
      });
      return;
    }

    if (
      !(await verifyJwt({
        token,
        base64PublicKeyPem: "ACCESS_TOKEN_PUBLIC_KEY",
      }))
    ) {
      jsonMessage(ctx, 403, { msg: "token is expired" });
      return;
    }

    const socket = ctx.upgrade();

    socket.addEventListener("open", this.onOpen.bind(this));
    socket.addEventListener("message", this.onMessage.bind(this));
    socket.addEventListener("close", this.onClose.bind(this));
    socket.addEventListener("error", this.onError.bind(this));

    jsonMessage(ctx, 200, { msg: "connected" });
  }

  private onOpen() {
    console.log("new connection detected");
  }

  private onMessage(ev: MessageEvent) {
    const data: GatewayMessageData = JSON.parse(ev.data);

    switch (data.event) {
      case "":
        break;
    }

    console.log(data);
  }

  private onClose() {
  }

  private onError(err: Event) {
    console.log(err);
  }
}

export default GatewayController;
