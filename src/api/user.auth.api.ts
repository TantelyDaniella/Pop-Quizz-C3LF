import createClient from "../modules/api.client.ts";
import type {loginData, registerData} from "../type/auth.types.ts"

export const AuthApi = () => {
    const client = createClient("auth");

    return {
        createUser : (data : registerData) =>
            client.post(`register`, data),
        authenticateUser : (data : loginData ) =>
            client.post(`login`, data),
    }
}