import { Application } from "@oak/oak";
import logger from "@quirkware/logger";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import Router from "./main.router.ts";

const app = new Application();

// @ts-ignore: hide deno-lint
app.use(logger());

app.use(oakCors());
app.use(Router.routes());
app.use(Router.allowedMethods());

app.addEventListener(
  "listen",
  () =>
    console.log(
      "run at http://localhost:3001/",
    ),
);

await app.listen({ port: 3001 });
