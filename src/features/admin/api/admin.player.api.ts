import createClient from "@/lib/api.client";

export const AdminPlayerApi = () => {
  const client = createClient("admin/players");

  return {
    list: () => client.get("list"),
    update: (playerId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
      client.patch(`update/${playerId}`, payload),
    remove: (playerId: number) => client.delete(`delete/${playerId}`),
  };
};
