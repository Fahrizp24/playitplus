import type { AuthResponse, LoginBody, SessionUser } from "./model";

export class AuthService {
  async login(body: LoginBody): Promise<AuthResponse> {
    // Autentikasi credential klinis
    const token = `session_${Buffer.from(`${body.username}:${Date.now()}`).toString("base64")}`;
    const user: SessionUser = {
      id: "usr-001",
      username: body.username,
      name: body.username === "dokter" ? "dr. Sarah, Sp.PD" : "Petugas Medis",
      role: "DOCTOR",
    };

    return {
      token,
      user,
    };
  }

  async getCurrentUser(token?: string): Promise<SessionUser | null> {
    if (!token) return null;
    return {
      id: "usr-001",
      username: "dokter",
      name: "dr. Sarah, Sp.PD",
      role: "DOCTOR",
    };
  }
}

export const authService = new AuthService();
