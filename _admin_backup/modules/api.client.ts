import axios, { type AxiosRequestConfig } from "axios";
import APP_CONFIG from "../../app.config";

const createClient = (path: string) => {
    const API_CONFIG = APP_CONFIG.API_CONFIG;
    const BASE_URL = `http://${API_CONFIG.hostname}:${API_CONFIG.port}/api/${path}`;
    const getAuth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
    const authConfig = (config: AxiosRequestConfig): AxiosRequestConfig => ({
        ...config,
        headers: { ...config.headers, ...getAuth() },
    });

    return {
        get:    (endpoint: string, config: AxiosRequestConfig = {}) =>
            axios.get(`${BASE_URL}/${endpoint}`, authConfig(config)).then(r => r.data),
        post:   (endpoint: string, data: unknown, config: AxiosRequestConfig = {}) =>
            axios.post(`${BASE_URL}/${endpoint}`, data, authConfig(config)).then(r => r.data),
        put:    (endpoint: string, data: unknown, config: AxiosRequestConfig = {}) =>
            axios.put(`${BASE_URL}/${endpoint}`, data, authConfig(config)).then(r => r.data),
        patch:  (endpoint: string, data: unknown, config: AxiosRequestConfig = {}) =>
            axios.patch(`${BASE_URL}/${endpoint}`, data, authConfig(config)).then(r => r.data),
        delete: (endpoint: string, config: AxiosRequestConfig = {}) =>
            axios.delete(`${BASE_URL}/${endpoint}`, authConfig(config)).then(r => r.data),
        getAuth,
    };
};

export default createClient;