import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSocket from "@/features/game-engine/hooks/useSocket";
import GameResults from "@/features/game-engine/components/GameResults";

export default function GameResultPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const socket = useSocket();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const onShow = () => setShowButton(true);
    socket.on("show-leaderboard", onShow);
    return () => { socket.off("show-leaderboard", onShow); };
  }, [socket]);

  return (
    <GameResults
      gameId={Number(gameId)}
      showLeaderboard={showButton}
    />
  );
}