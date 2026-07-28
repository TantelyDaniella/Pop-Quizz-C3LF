import { useMutation } from "@tanstack/react-query";
import { AdminGameService } from "../services/admin.game.service";

export function useOpenNextQuestion() {
  const { mutate: openNextQuestion, isPending, error } = useMutation({
    mutationFn: (gameId: number) => AdminGameService.openNextQuestion(gameId),
  });

  return { openNextQuestion, isPending, error };
}
