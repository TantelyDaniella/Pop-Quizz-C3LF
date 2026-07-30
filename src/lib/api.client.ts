import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

function createClient(endpoint: string) {
  const client = axios.create({
    baseURL: `${BASE_URL}/${endpoint}`,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    get: <T>(url: string, params?: Record<string, unknown>) =>
      client.get<T>(url, { params }).then((r) => r.data),
    post: <T>(url: string, data?: unknown) =>
      client.post<T>(url, data).then((r) => r.data),
    put: <T>(url: string, data?: unknown) =>
      client.put<T>(url, data).then((r) => r.data),
    patch: <T>(url: string, data?: unknown) =>
      client.patch<T>(url, data).then((r) => r.data),
    delete: <T>(url: string) =>
      client.delete<T>(url).then((r) => r.data),
  };
}

export default createClient;
