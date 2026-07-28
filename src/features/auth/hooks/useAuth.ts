import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import type { LoginData, RegisterData } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useAuthenticate() {
  const { mutate, isPending, isSuccess, error, data } = useMutation({
    mutationFn: (data: LoginData) => AuthService.authenticate(data),
    onSuccess: (res : any ) => {
      localStorage.setItem("token", res.data.token);
    },
  });
  return { authenticate: mutate, isPending, isSuccess, error, data };
}

export function useRegister() {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (data: RegisterData) => AuthService.register(data),
  });
  return { register: mutate, isPending, isSuccess, error };
}

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setTimeout(() => {
      toast.success("Déconnexion réussie", { duration: 3000 });
    }, 1000);
  };

  return { logout };
}
