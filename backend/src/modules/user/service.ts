import type { UpdateProfileBody, UserProfile } from "./model";

export class UserService {
  private currentProfile: UserProfile = {
    id: "usr-001",
    username: "dokter",
    fullName: "dr. Sarah, Sp.PD",
    specialization: "Spesialis Penyakit Dalam",
    sipNumber: "SIP.440/012/DS/Dinkes/2024",
    clinicName: "Poliklinik Rawat Jalan",
  };

  async getProfile(): Promise<UserProfile> {
    return this.currentProfile;
  }

  async updateProfile(updates: UpdateProfileBody): Promise<UserProfile> {
    this.currentProfile = {
      ...this.currentProfile,
      ...updates,
    };
    return this.currentProfile;
  }
}

export const userService = new UserService();
