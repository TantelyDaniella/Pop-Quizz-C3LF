import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm.tsx";
import RegisterForm from "../components/auth/RegisterForm.tsx";

const AuthRoutes = (
    <Route>
        <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/login" element={<LoginForm/>} />
        </Route>
    </Route>
);

export default AuthRoutes;