
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
      console.log(
        "📡 POST open-next-question :",
        gameId
      );

      return AdminGameService.openNextQuestion(gameId);
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