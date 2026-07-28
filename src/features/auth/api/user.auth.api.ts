import createClient from "@/lib/api.client";
import type { LoginData, RegisterData } from "../types/auth.types";

export const AuthApi = () => {
  const client = createClient("auth");

  return {
    createUser: (data: RegisterData) => client.post("register", data),
    authenticateUser: (data: LoginData) => client.post("login", data),
  };
};
