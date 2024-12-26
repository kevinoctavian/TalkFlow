import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  root: "./client",
  // @ts-ignore: ignore deno lint
  plugins: [deno(), react()],
});
