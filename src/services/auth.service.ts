import {AuthApi} from "../api/user.auth.api.ts";
import type {loginData, registerData} from "../type/auth.types.ts";


const Api = AuthApi()

export const AuthService ={
        register : async (data : registerData) => {
                console.log("DATA : ", data)
                const res = await Api.createUser(data)
                console.log("RESPONSE : ", res)
                return res;
        },
        authenticate : async (data : loginData) => {
                const res = await Api.authenticateUser(data)
                console.log("RESPONSE : ", res)
                return res
        },
}