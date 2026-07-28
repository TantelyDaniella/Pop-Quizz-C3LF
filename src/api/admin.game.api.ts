import createClient from "../modules/api.client";
import type { CreateQuizPayload, UpdateQuizPayload } from "../types/quiz";
const client = createClient("admin/game");

export const AdminGameApi = {
  list: () => client.get("list"),

  view: (gameId: number) =>
    client.get(`view/${gameId}`),

  create: (payload: CreateQuizPayload) =>
    client.post("create", payload),

  update: (
    gameId: number,
    payload: UpdateQuizPayload
  ) =>
    client.patch(`update/${gameId}`, payload),

  remove: (gameId: number) =>
    client.delete(`delete/${gameId}`),

  start: (gameId: number) =>
    client.post(`${gameId}/start`, {}),

  end: (gameId: number) =>
    client.post(`${gameId}/end`, {}),

  results: (gameId: number, playerId: number) =>
    client.get(`${gameId}/results`, {
      params: { playerId },
    }),
};