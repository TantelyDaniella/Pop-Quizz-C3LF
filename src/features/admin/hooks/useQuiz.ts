import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminGameService } from "../services/admin.game.service";
import type { QuizResponse, CreateQuizPayload, UpdateQuizPayload } from "../types/quiz";

export function useQuiz() {
  const { data, isLoading, error, refetch } = useQuery<QuizResponse>({
    queryKey: ["quizzes"],
    queryFn: () => AdminGameService.list() as Promise<QuizResponse>,
  });

  return { quizzes: data?.data ?? [], isLoading, error, refetch };
}

export function useQuizById(gameId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quiz", gameId],
    queryFn: () => AdminGameService.view(gameId),
    enabled: !!gameId,
  });

  return { quiz: data?.data, isLoading, error, refetch };
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  const { mutate: createQuiz, isPending } = useMutation({
    mutationFn: (data: CreateQuizPayload) => AdminGameService.create(data.title, data.totalQuestions, data.createdBy),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["quizzes"] }); },
  });

  return { createQuiz, isPending };
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  const { mutate: updateQuiz, isPending } = useMutation({
    mutationFn: ({ gameId, data }: { gameId: number; data: UpdateQuizPayload }) =>
      AdminGameService.update(gameId, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      void queryClient.invalidateQueries({ queryKey: ["quiz", variables.gameId] });
    },
  });

  return { updateQuiz, isPending };
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  const { mutate: deleteQuiz, isPending } = useMutation({
    mutationFn: (gameId: number) => AdminGameService.remove(gameId),
    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      void queryClient.removeQueries({ queryKey: ["quiz", gameId] });
    },
  });

  return { deleteQuiz, isPending };
}

export function useStartQuiz() {
  const queryClient = useQueryClient();

  const { mutate: startQuiz, isPending } = useMutation({
    mutationFn: (gameId: number) => AdminGameService.start(gameId),
    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      void queryClient.invalidateQueries({ queryKey: ["quiz", gameId] });
    },
  });

  return { startQuiz, isPending };
}

export function useEndQuiz() {
  const queryClient = useQueryClient();

  const { mutate: endQuiz, isPending } = useMutation({
    mutationFn: (gameId: number) => AdminGameService.end(gameId),
    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      void queryClient.invalidateQueries({ queryKey: ["quiz", gameId] });
    },
  });

  return { endQuiz, isPending };
}

export function useQuizResults(gameId: number, playerId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quiz-results", gameId, playerId],
    queryFn: () => AdminGameService.results(gameId, playerId),
    enabled: !!gameId && !!playerId,
  });

  return { results: data, isLoading, error, refetch };
}

/**
 * Classement complet d'une partie (tous les joueurs).
 */
export function useGameLeaderboard(gameId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["game-leaderboard", gameId],
    queryFn: () => AdminGameService.getLeaderboard(gameId),
    enabled: !!gameId && enabled,
  });

  return { leaderboard: data, isLoading, error, refetch };
}

/**
 * Résultats détaillés d'un joueur précis pour une partie.
 */
export function useGameResults(
  gameId: number,
  playerId: number,
  enabled = true
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["game-results", gameId, playerId],
    queryFn: () => AdminGameService.results(gameId, playerId),
    enabled: !!gameId && !!playerId && enabled,
  });

  return { results: data, isLoading, error, refetch };
}