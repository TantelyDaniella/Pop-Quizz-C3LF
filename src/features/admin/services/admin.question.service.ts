import { AdminQuestionApi } from "../api/admin.question.api";
import type { CreateQuestionPayload } from "../types/question";

const api = AdminQuestionApi();

export const AdminQuestionService = {
  list: () => api.list(),
  create: (payload: CreateQuestionPayload) => api.create(payload),
  update: (questionId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
    api.update(questionId, payload),
  remove: (questionId: number) => api.remove(questionId),
};
