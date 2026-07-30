import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminQuestionService } from "../services/admin.question.service";
import type { QuestionResponse, CreateQuestionPayload } from "../types/question";

export function useQuestion() {
  const { data, isLoading, error, refetch } = useQuery<QuestionResponse>({
    queryKey: ["questions"],
    queryFn: () => AdminQuestionService.list() as Promise<QuestionResponse>,
  });

  return { questions: data?.data ?? [], isLoading, error, refetch };
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  const { mutate: submitQuestion, isPending } = useMutation({
    mutationFn: (data: CreateQuestionPayload) => AdminQuestionService.create(data),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["questions"] }); },
  });

  return { submitQuestion, isPending };
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  const { mutate: deleteQuestion, isPending } = useMutation({
    mutationFn: (questionId: number) => AdminQuestionService.remove(questionId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["questions"] }); },
  });

  return { deleteQuestion, isPending };
}
