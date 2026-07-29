import { AuthApi } from "../api/user.auth.api";
import type { LoginData, RegisterData } from "../types/auth.types";

const api = AuthApi();

export const AuthService = {
  register: async (data: RegisterData) => api.createUser(data),
  authenticate: async (data: LoginData) => {
    try {
      return await api.authenticateUser(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number }; message?: string };
      if (axiosErr?.response?.status === 401) {
        throw new Error("Mot de passe ou addresse email invalide");
      }
      throw err;
    }
  },
};
