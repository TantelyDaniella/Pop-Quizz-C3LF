import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../components/auth/LoginForm.tsx";

const AuthRoutes = (
    <Route>
        <Route element={<AuthLayout />}>
            <Route path="/register" element={<h1>Register Page</h1>} />
            <Route path="/login" element={<LoginForm/>} />
        </Route>
    </Route>
);

export default AuthRoutes;