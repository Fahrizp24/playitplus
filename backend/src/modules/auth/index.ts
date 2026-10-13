import { Elysia, t } from "elysia";
import { AuthResponseSchema, LoginBodySchema, SessionUserSchema } from "./model";
import { authService } from "./service";

export const authController = new Elysia({ prefix: "/api/auth" })
  .post(
    "/login",
    async ({ body }) => {
      return await authService.login(body);
    },
    {
      body: LoginBodySchema,
      response: {
        200: AuthResponseSchema,
      },
    }
  )
  .get(
    "/me",
    async ({ headers, set }) => {
      const authHeader = headers["authorization"];
      const token = authHeader ? authHeader.replace("Bearer ", "") : undefined;
      const user = await authService.getCurrentUser(token);
      if (!user) {
        set.status = 401;
        return { error: "Belum terautentikasi." };
      }
      return user;
    },
    {
      response: {
        200: SessionUserSchema,
        401: t.Object({ error: t.String() }),
      },
    }
  );
