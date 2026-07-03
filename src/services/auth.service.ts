import {AuthApi} from "../api/user.auth.api.ts";
import type {loginData, registerData} from "../type/auth.types.ts";


const Api = AuthApi()

export const AuthService ={
        register : (data : registerData) => {
                console.log("DATA : ", data)
                const res = Api.createUser(data)
                console.log("RESPONSE : ", res)
                return res;
        },
        authenticate : (data : loginData) => Api.authenticateUser(data),
}