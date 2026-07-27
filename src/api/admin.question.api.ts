import createClient from "../modules/api.client";
const client = createClient("admin/questions");
export const AdminQuestionApi = {
   
    list: () => client.get("list"),
    create: (payload: { title: string; totalQuestions?: number; createdBy?: number }) =>
        client.post("create", payload),
    update: (gameId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
        client.patch(`update/${gameId}`, payload),
    remove: (gameId: number) => client.delete(`delete/${gameId}`)

        
};