import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../features/admin/pages/HomePage";
import QuestionsPage from "../features/admin/pages/QuestionPage";
import PlayerPage from "../features/admin/pages/PlayerPage";
import QuizzPage from "../features/admin/pages/QuizzPage";
import SettingPage from "../features/admin/pages/SettingPage";
import ResultPage from "../features/admin/pages/ResultPage";
import QuizLivePage from "../features/admin/pages/QuizLivePage";
import QuizQuestionPage from "../features/admin/pages/QuizQuestionPage";

const AdminRoutes = (
  <>
    {/* Routes with sidebar */}
    <Route element={<AdminLayout />}>
      <Route path="/admin" element={<HomePage />} />

      <Route path="/admin/players" element={<PlayerPage />} />
      <Route path="/admin/players/inactive" element={<PlayerPage />} />
      <Route path="/admin/players/active" element={<PlayerPage />} />

      <Route path="/admin/quiz" element={<QuizzPage />} />
      <Route path="/admin/quiz/waiting" element={<QuizzPage />} />
      <Route path="/admin/quiz/running" element={<QuizzPage />} />
      <Route path="/admin/quiz/finished" element={<QuizzPage />} />

      <Route path="/admin/setting" element={<SettingPage />} />
      <Route path="/admin/result" element={<ResultPage />} />

      <Route path="/admin/questions" element={<QuestionsPage />} />
      <Route path="/admin/questions/general-knowledge" element={<QuestionsPage />} />
      <Route path="/admin/questions/linux-commands" element={<QuestionsPage />} />
      <Route path="/admin/questions/shell-programming" element={<QuestionsPage />} />
    </Route>

    {/* Routes without sidebar (live quiz) */}
    <Route path="/admin/quiz/:gameId/live" element={<QuizLivePage />} />
    <Route path="/admin/quiz/:gameId/round/:roundNumber" element={<QuizQuestionPage />} />
  </>
);

export default AdminRoutes;
