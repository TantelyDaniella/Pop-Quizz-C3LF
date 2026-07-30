import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    id : string;
    email: string;
    role: string;
};

type ProtectedRouteProps = {
    requiredRole?: string;
};

export default function ProtectedRoute({
                                           requiredRole,
                                       }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Vérification token
        if (!token) {
            return <Navigate to="/login" replace />;
        }

        // Vérification rôle
        if (requiredRole && decoded.role !== requiredRole) {
            return <Navigate to={decoded.role === "admin" ? "/admin" : "/"} replace />;
        }

        return <Outlet />;
    } catch {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
}