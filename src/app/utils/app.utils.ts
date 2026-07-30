import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export function handleUnauthorized() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export function getPlayerIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const id = Number(decoded.id);
    return Number.isNaN(id) ? null : id;
  } catch {
    return null;
  }
}
