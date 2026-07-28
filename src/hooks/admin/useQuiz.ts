import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AdminGameApi } from "../../api/admin.game.api";

import type {
  QuizResponse,
  CreateQuizPayload,
  UpdateQuizPayload,
} from "../../types/quiz";

/**
 * Liste des quiz
 */
export function useQuiz() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<QuizResponse>({
    queryKey: ["quizzes"],
    queryFn: () => AdminGameApi.list(),
  });

  return {
    quizzes: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Détail d'un quiz
 */
export function useQuizById(gameId: number) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quiz", gameId],
    queryFn: () => AdminGameApi.view(gameId),
    enabled: !!gameId,
  });

  return {
    quiz: data?.data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Création d'un quiz
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  const {
    mutate: createQuiz,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: CreateQuizPayload) =>
      AdminGameApi.create(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });
    },
  });

  return {
    createQuiz,
    isPending,
    isSuccess,
    error,
  };
}

/**
 * Modification d'un quiz
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  const {
    mutate: updateQuiz,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: ({
      gameId,
      data,
    }: {
      gameId: number;
      data: UpdateQuizPayload;
    }) =>
      AdminGameApi.update(gameId, data),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["quiz", variables.gameId],
      });
    },
  });

  return {
    updateQuiz,
    isPending,
    isSuccess,
    error,
  };
}

/**
 * Suppression d'un quiz
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteQuiz,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (gameId: number) =>
      AdminGameApi.remove(gameId),

    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });

      void queryClient.removeQueries({
        queryKey: ["quiz", gameId],
      });
    },
  });

  return {
    deleteQuiz,
    isPending,
    isSuccess,
    error,
  };
}

/**
 * Démarrer un quiz
 *
 * POST /api/admin/game/{gameId}/start
 */
export function useStartQuiz() {
  const queryClient = useQueryClient();

  const {
    mutate: startQuiz,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (gameId: number) =>
      AdminGameApi.start(gameId),

    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["quiz", gameId],
      });
    },
  });

  return {
    startQuiz,
    isPending,
    isSuccess,
    error,
  };
}

/**
 * Terminer un quiz
 *
 * POST /api/admin/game/{gameId}/end
 */
export function useEndQuiz() {
  const queryClient = useQueryClient();

  const {
    mutate: endQuiz,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (gameId: number) =>
      AdminGameApi.end(gameId),

    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["quiz", gameId],
      });
    },
  });

  return {
    endQuiz,
    isPending,
    isSuccess,
    error,
  };
}

/**
 * Résultats d'un quiz
 *
 * GET /api/admin/game/{gameId}/results
 */
export function useQuizResults(
  gameId: number,
  playerId: number
) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "quiz-results",
      gameId,
      playerId,
    ],
    queryFn: () =>
      AdminGameApi.results(
        gameId,
        playerId
      ),
    enabled:
      !!gameId && !!playerId,
  });

  return {
    results: data?.data,
    isLoading,
    error,
    refetch,
  };
}