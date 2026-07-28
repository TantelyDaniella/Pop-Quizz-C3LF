import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/admin/HomePage";
import QuestionPage from "../pages/admin/QuestionPage";
import PlayerPage from "../pages/admin/PlayerPage";
import QuizzPage from "../pages/admin/QuizzPage";
import SettingPage from "../pages/admin/SettingPage";
import ResultPage from "../pages/admin/ResultPage";
import QuizLivePage from "../pages/admin/QuizLivePage";
import QuizQuestionPage from "../pages/admin/QuizQuestionPage";

const AdminRoutes = (
  <>
    {/* Routes avec Sidebar */}
    <Route element={<AdminLayout />}>
      <Route path="/admin" element={<HomePage />} />

      <Route path="/admin/players" element={<PlayerPage />} />
      <Route path="/admin/players/inactive" element={<PlayerPage />} />
      <Route path="/admin/players/active" element={<PlayerPage />} />

      <Route path="/admin/question" element={<QuestionPage />} />

      <Route path="/admin/quiz" element={<QuizzPage />} />
      <Route path="/admin/quiz/waiting" element={<QuizzPage />} />
      <Route path="/admin/quiz/running" element={<QuizzPage />} />
      <Route path="/admin/quiz/finished" element={<QuizzPage />} />

      <Route path="/admin/setting" element={<SettingPage />} />
      <Route path="/admin/result" element={<ResultPage />} />

      <Route path="/admin/questions" element={<QuestionPage />} />

      <Route
        path="/admin/questions/general-knowledge"
        element={<QuestionPage />}
      />

      <Route
        path="/admin/questions/linux-commands"
        element={<QuestionPage />}
      />

      <Route
        path="/admin/questions/shell-programming"
        element={<QuestionPage />}
      />
    </Route>

    {/* Route SANS Sidebar */}
    <Route
      path="/admin/quiz/:gameId/live"
      element={<QuizLivePage />}
    />
    <Route
    path="/admin/quiz/:gameId/round/:roundNumber"
    element={<QuizQuestionPage />}
    />
  </>
);

export default AdminRoutes;