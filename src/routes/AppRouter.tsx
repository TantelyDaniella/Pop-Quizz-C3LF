import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes.tsx";
import {NavigationProvider} from "../context/NavigationContext.tsx";
import UserRoutes from "./UserRoutes.tsx"
import AdminRoutes from "./AdminRoutes.tsx"
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import LoginForm from "@/components/auth/LoginForm.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <NavigationProvider>
                <Routes>
                    {AuthRoutes}
                    <Route element={<ProtectedRoute requiredRole={"player"} />}> {UserRoutes} </Route>
                    <Route element={<ProtectedRoute requiredRole={"admin"}/>}> {AdminRoutes} </Route>
                    <Route path="*" element={<LoginForm/>} />
                </Routes>
            </NavigationProvider>
        </BrowserRouter>
    );
}