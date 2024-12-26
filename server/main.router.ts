import { Router } from "@oak/oak";
import GatewayController from "./controller/gateway.controller.ts";
import AuthController from "./controller/auth.controller.ts";
import UserController from "./controller/user.controller.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = `<html><h1>Welcome to TalkFlow api</h1></html>`;
});

// Websocket
const gateway = new GatewayController();
router.get("/gateway", gateway.ConnectWS);

// auth route
router.post("/api/auth/register", AuthController.register);
router.post("/api/auth/login", AuthController.login);
router.delete("/api/auth/logout", AuthController.logout);
router.get("/api/auth/refresh_token", (_) => {});

// user route
router.get("/api/user/:id", UserController.getUser);
router.put("/api/user/:id", (_) => {});
router.delete("/api/user/:id", (_) => {});

// chat route
router.post("/api/chat", (_) => {});
router.get("/api/chat/:id", (_) => {});
router.put("/api/chat/:id", (_) => {});

export default router;
