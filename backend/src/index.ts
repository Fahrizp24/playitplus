import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { config } from "./config";
import { authController } from "./modules/auth";
import { consultationController } from "./modules/consultation";
import { userController } from "./modules/user";

export const app = new Elysia()
  .use(
    cors({
      origin: [config.corsOrigin],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/", () => ({
    message: "PlayItPlus Clinical Documentation & Patient Summary API",
    version: "0.1.0",
    docs: "/api/consultation/samples",
  }))
  .use(authController)
  .use(userController)
  .use(consultationController)
  .listen(config.port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname || "localhost"}:${app.server?.port || config.port}`
);

export type App = typeof app;
