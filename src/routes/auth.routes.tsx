import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterForm from "../features/auth/components/RegisterForm";

const AuthRoutes = (
  <Route>
    <Route element={<AuthLayout />}>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Route>
  </Route>
);

export default AuthRoutes;
