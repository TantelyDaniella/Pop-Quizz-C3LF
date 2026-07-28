import createClient from "@/lib/api.client";

export const AdminGameApi = () => {
  const client = createClient("admin/game");

  return {
    list: () => client.get("list"),
    view: (gameId: number) => client.get(`view/${gameId}`),
    create: (payload: { title: string; totalQuestions?: number; createdBy?: number }) =>
      client.post("create", payload),
    update: (gameId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
      client.patch(`update/${gameId}`, payload),
    remove: (gameId: number) => client.delete(`delete/${gameId}`),
    start: (gameId: number) => client.post(`${gameId}/start`, {}),
    end: (gameId: number) => client.post(`${gameId}/end`, {}),
    results: (gameId: number, playerId: number) =>
      client.get(`${gameId}/results`, { params: { playerId } }),
  };
};
