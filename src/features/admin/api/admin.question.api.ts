import createClient from "@/lib/api.client";
import type { CreateQuestionPayload } from "../types/question";

export const AdminQuestionApi = () => {
  const client = createClient("admin/questions");

  return {
    list: () => client.get("list"),
    create: (payload: CreateQuestionPayload) =>
      client.post("create", payload),
    update: (questionId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
      client.patch(`update/${questionId}`, payload),
    remove: (questionId: number) => client.delete(`delete/${questionId}`),
  };
};
