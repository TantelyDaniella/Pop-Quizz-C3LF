import { useQuery } from "@tanstack/react-query";
import { AdminQuestionApi } from "../../api/admin.question.api";
import type { QuestionResponse, CreateQuestionPayload } from "../../types/question";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useQuestion() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<QuestionResponse>({
    queryKey: ["questions"],
    queryFn: () => AdminQuestionApi.list(),
  });

  return {
    questions: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

export function useCreateQuestion() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        isSuccess,
        error,
    } = useMutation({
        mutationFn: async (data: CreateQuestionPayload) =>
            await AdminQuestionApi.create(data),

        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["questions"],
            });
        },
    });

    return {
        submitQuestion: mutate,
        isPending,
        isSuccess,
        error,
    };
}


export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteQuestion,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (questionId: number) =>
      AdminQuestionApi.remove(questionId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });

  return {
    deleteQuestion,
    isPending,
    isSuccess,
    error,
  };
}