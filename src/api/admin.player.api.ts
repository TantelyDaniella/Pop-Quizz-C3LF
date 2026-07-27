import createClient from "../modules/api.client";
const client = createClient("admin/players");

export const AdminPlayerApi =  {

    list: () => client.get("list"),
    update: (playerId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
        client.patch(`update/${playerId}`, payload),
    remove: (playerId: number) => client.delete(`delete/${playerId}`),
      

};

