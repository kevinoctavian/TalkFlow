/// <reference lib="deno.ns" />
import { type ConnectionOptions, createConnection } from "mysql2/promise";
import "@std/dotenv/load";

const config: ConnectionOptions = {
  host: "127.0.0.1",
  user: Deno.env.get("MYSQL_USER"),
  password: Deno.env.get("MYSQL_PASS"),
  database: Deno.env.get("MYSQL_DB"),
  debug: false,
  supportBigNumbers: true,
  bigNumberStrings: true,
};

const db = await createConnection(config);

export default db;
