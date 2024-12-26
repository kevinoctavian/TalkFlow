/// <reference lib="deno.ns" />

import { Client } from "deno_mysql";
import "@std/dotenv/load";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: Deno.env.get("MYSQL_USER"),
  password: Deno.env.get("MYSQL_PASS"),
  db: Deno.env.get("MYSQL_DB"),
});

await client.execute(`CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_active BOOL DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME,
  CONSTRAINT PK_Userid PRIMARY KEY (user_id)
);`);

await client.execute(`CREATE TABLE IF NOT EXISTS messages (
  message_id INT NOT NULL,
  sender_id INT NOT NULL,
  reciver_id INT NOT NULL,
  message_type ENUM('msg', 'dm', 'attachment') NOT NULL,
  content VARCHAR(255) NOT NULL,
  CONSTRAINT PK_Messageid PRIMARY KEY(message_id),
  CONSTRAINT FK_Senderid FOREIGN KEY(sender_id) REFERENCES users(user_id),
  CONSTRAINT FK_Reciverid FOREIGN KEY(reciver_id) REFERENCES users(user_id)
)`);

client.close();
