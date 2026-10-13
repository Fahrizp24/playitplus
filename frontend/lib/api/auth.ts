import { eden } from "./eden";
import type { AuthResponse, SessionUser } from "../types";

export async function login(credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const { data, error } = await eden.api.auth.login.post(credentials);
  if (error) {
    throw new Error("Gagal melakukan login.");
  }
  return data;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data, error } = await eden.api.auth.me.get();
  if (error) {
    return null;
  }
  return data;
}
