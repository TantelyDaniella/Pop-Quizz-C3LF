
import { GameService } from "../services/game.service";
import { AdminGameService } from "../services/admin.game.service";

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
      return GameService.openNextQuestion(gameId);
    },

    onSuccess: (response) => {},

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


export function useShowLeaderboard() {
  const { mutate: showLeaderboard, isPending } = useMutation({
    mutationFn: (gameId: number) => AdminGameService.showLeaderboard(gameId),
  });

  return { showLeaderboard, isPending };
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