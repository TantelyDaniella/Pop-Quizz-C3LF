import { useQuery } from "@tanstack/react-query";
import { AdminQuestionApi } from "../../api/admin.question.api";
import type { QuestionResponse } from "../../types/question";

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