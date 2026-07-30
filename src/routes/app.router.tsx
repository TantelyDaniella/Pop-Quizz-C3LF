import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./auth.routes";
import { NavigationProvider } from "../app/context/NavigationContext";
import PlayerRoutes from "./player.routes";
import AdminRoutes from "./admin.routes";
import ProtectedRoute from "./protected.routes";
import LoginForm from "@/features/auth/components/LoginForm";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <Routes>
          {AuthRoutes}
          <Route element={<ProtectedRoute requiredRole="player" />}>
            {PlayerRoutes}
          </Route>
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            {AdminRoutes}
          </Route>
          <Route path="*" element={<LoginForm />} />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}
