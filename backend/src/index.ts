import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => ({
    message: "PlayItPlus Backend API",
  }))
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
