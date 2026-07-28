import { AuthApi } from "../api/user.auth.api";
import type { LoginData, RegisterData } from "../types/auth.types";

const api = AuthApi();

export const AuthService = {
  register: async (data: RegisterData) => api.createUser(data),
  authenticate: async (data: LoginData) => api.authenticateUser(data),
};
