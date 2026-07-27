import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/admin/HomePage.tsx";
import QuestionPage from "../pages/admin/QuestionPage.tsx";
import PlayerPage from "../pages/admin/PlayerPage.tsx";
import QuizzPage from "../pages/admin/QuizzPage.tsx";
import SettingPage from "../pages/admin/SettingPage.tsx";
import ResultPage from "../pages/admin/ResultPage.tsx";

const AdminRoutes = (
    <Route element={<AdminLayout />}>
        <Route path="/admin" element={<HomePage/>} />
        <Route path="/admin/player" element={<PlayerPage/>} />
        <Route path="/admin/question" element={<QuestionPage/>} />
        <Route path="/admin/quizz" element={<QuizzPage/>} />
        <Route path="/admin/setting" element={<SettingPage/>} />
        <Route path="/admin/result" element={<ResultPage/>} />
    </Route>
);

export default AdminRoutes;