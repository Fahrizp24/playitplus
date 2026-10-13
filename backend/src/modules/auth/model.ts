import { t, type Static } from "elysia";

export const LoginBodySchema = t.Object({
  username: t.String({ minLength: 3 }),
  password: t.String({ minLength: 6 }),
});

export type LoginBody = Static<typeof LoginBodySchema>;

export const SessionUserSchema = t.Object({
  id: t.String(),
  username: t.String(),
  name: t.String(),
  role: t.Union([t.Literal("DOCTOR"), t.Literal("NURSE"), t.Literal("ADMIN")]),
});

export type SessionUser = Static<typeof SessionUserSchema>;

export const AuthResponseSchema = t.Object({
  token: t.String(),
  user: SessionUserSchema,
});

export type AuthResponse = Static<typeof AuthResponseSchema>;
