import { AdminPlayerApi } from "../api/admin.player.api";

const api = AdminPlayerApi();

export const AdminPlayerService = {
  list: () => api.list(),
  update: (playerId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
    api.update(playerId, payload),
  remove: (playerId: number) => api.remove(playerId),
};
