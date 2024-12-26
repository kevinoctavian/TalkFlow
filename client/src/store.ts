import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/auth.ts";
import websocket from "./features/websocket/websocket.ts";

export default configureStore({
  reducer: {
    auth,
    websocket,
  },
});
