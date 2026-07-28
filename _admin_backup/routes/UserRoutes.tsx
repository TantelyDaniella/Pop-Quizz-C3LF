import { Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

const UserRoutes = (
    <Route element={<UserLayout />}>
        <Route path="/" element={<h1>USER MAIN PAGE</h1>} />
    </Route>
);

export default UserRoutes;