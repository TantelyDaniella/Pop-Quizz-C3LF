import { Route } from "react-router-dom";
import PlayerLayout from "../layouts/PlayerLayout";
import GameView from "@/features/game-engine/components/GameView";
import LeaderboardPage from "@/features/game-engine/components/LeaderboardPage";

const PlayerRoutes = (
  <Route element={<PlayerLayout />}>
    <Route path="/" element={<GameView />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
  </Route>
);

export default PlayerRoutes;
