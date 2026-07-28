import createClient from "../modules/api.client";
import type { CreateQuestionPayload } from "../types/question";
const client = createClient("admin/questions");
export const AdminQuestionApi = {
   
    list: () => client.get("list"),
    create: (payload: CreateQuestionPayload) =>
        client.post("create", payload),
    update: (questionId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
        client.patch(`update/${questionId}`, payload),
    remove: (questionId: number) => client.delete(`delete/${questionId}`)

        
};
