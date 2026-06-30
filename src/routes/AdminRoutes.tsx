import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = (
    <Route element={<AdminLayout />}>
        <Route path="/admin" element={<h1>ADMIN PAGE</h1>} />
        <Route path="/admin/parametres" element={<div>Paramètres admin</div>} />
    </Route>
);

export default AdminRoutes;