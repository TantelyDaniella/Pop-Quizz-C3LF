
import { GameService } from "../services/game.service";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


export function useOpenNextQuestion() {
  const {
    mutate: openNextQuestion,
    isPending,
    error,
  } = useMutation({
    mutationFn: (gameId: number) => {
      console.log(
        "📡 POST open-next-question :",
        gameId
      );

      return GameService.openNextQuestion(gameId);
    },

    onSuccess: (response) => {
      console.log(
        "✅ Question ouverte côté backend :",
        response
      );
    },

    onError: (error: any) => {
      console.error(
        "❌ Erreur open-next-question"
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );
    },
  });

  return {
    openNextQuestion,
    isPending,
    error,
  };
}


/**
 * Classement complet d'une partie (tous les joueurs).
 */
export function useGameLeaderboard(gameId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["game-leaderboard", gameId],
    queryFn: () => GameService.getLeaderboard(gameId),
    enabled: !!gameId && enabled,
  });

  return { leaderboard: data?.data, isLoading, error, refetch };
}