import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import type { loginData, registerData } from "../type/auth.types";

export function useAuthenticate() {
    const { mutate, isPending, isSuccess, error, data } = useMutation({
        mutationFn: (data: loginData) => AuthService.authenticate(data),
        onSuccess: (res) => {
            localStorage.setItem("token", res.data.token);
        },
    });
    return { authenticate: mutate, isPending, isSuccess, error, data };
}

export function useRegister() {
    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationFn: (data: registerData) => AuthService.register(data),
    });
    return { register: mutate, isPending, isSuccess, error };
}