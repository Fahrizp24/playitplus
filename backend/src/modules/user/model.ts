import { t, type Static } from "elysia";

export const UserProfileSchema = t.Object({
  id: t.String(),
  username: t.String(),
  fullName: t.String(),
  specialization: t.String(),
  sipNumber: t.String(),
  clinicName: t.String(),
});

export type UserProfile = Static<typeof UserProfileSchema>;

export const UpdateProfileBodySchema = t.Object({
  fullName: t.Optional(t.String()),
  specialization: t.Optional(t.String()),
  clinicName: t.Optional(t.String()),
});

export type UpdateProfileBody = Static<typeof UpdateProfileBodySchema>;
