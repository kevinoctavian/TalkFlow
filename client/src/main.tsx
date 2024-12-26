import "./main.css";
// @deno-types="@types/react"
import { StrictMode } from "react";
// @deno-types="@types/react-dom/client"
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";

import App from "./App.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
