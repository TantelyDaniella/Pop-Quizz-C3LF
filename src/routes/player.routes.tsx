import { Route } from "react-router-dom";
import PlayerLayout from "../layouts/PlayerLayout";
import GameView from "@/features/game-engine/components/GameView";

const PlayerRoutes = (
  <Route element={<PlayerLayout />}>
    <Route path="/" element={<GameView />} />
  </Route>
);

export default PlayerRoutes;
