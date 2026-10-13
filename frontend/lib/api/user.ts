import { eden } from "./eden";
import type { UserProfile } from "../types";

export async function getUserProfile(): Promise<UserProfile> {
  const { data, error } = await eden.api.user.profile.get();
  if (error) {
    throw new Error("Gagal mengambil data profil dokter.");
  }
  return data;
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const { data, error } = await eden.api.user.profile.put(updates);
  if (error) {
    throw new Error("Gagal memperbarui data profil dokter.");
  }
  return data;
}
