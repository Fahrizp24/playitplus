import { Elysia } from "elysia";
import { UpdateProfileBodySchema, UserProfileSchema } from "./model";
import { userService } from "./service";

export const userController = new Elysia({ prefix: "/api/user" })
  .get(
    "/profile",
    async () => {
      return await userService.getProfile();
    },
    {
      response: {
        200: UserProfileSchema,
      },
    }
  )
  .put(
    "/profile",
    async ({ body }) => {
      return await userService.updateProfile(body);
    },
    {
      body: UpdateProfileBodySchema,
      response: {
        200: UserProfileSchema,
      },
    }
  );
