import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminGameApi } from "../../api/admin.game.api";
import type { QuizResponse, CreateQuizPayload, UpdateQuizPayload } from "../../types/quiz";

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

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["quizzes"],
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

export function useUpdateQuiz() { 
  const queryClient = useQueryClient();
   const { mutate: updateQuiz, isPending, isSuccess, error, } = 
   useMutation({ mutationFn: ({ gameId, data, }: { gameId: number; data: UpdateQuizPayload; }) => 
    AdminGameApi.update(gameId, data), 
   onSuccess: () => {
     void queryClient.invalidateQueries({ queryKey: ["quizzes"], 

     }); 
    }, 
    
    });
      return { updateQuiz, isPending, isSuccess, error, }; }