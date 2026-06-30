import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./AuthRoutes.tsx";
import {NavigationProvider} from "../context/NavigationContext.tsx";
import UserRoutes from "./UserRoutes.tsx"
import AdminRoutes from "./AdminRoutes.tsx"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <NavigationProvider>
                <Routes>
                    {AuthRoutes}
                    {UserRoutes}
                    {AdminRoutes}
                    <Route path="*" element={<h1>LOGIN</h1>} />
                </Routes>
            </NavigationProvider>
        </BrowserRouter>
    );
}