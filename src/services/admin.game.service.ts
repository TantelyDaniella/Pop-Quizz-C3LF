import { AdminGameApi } from "../api/admin.game.api";

const api = AdminGameApi();

export const AdminGameService = {
    list: () => api.list(),
    view: (gameId: number) => api.view(gameId),
    create: (title: string, totalQuestions?: number, createdBy?: number) =>
        api.create({ title, totalQuestions, createdBy }),
    update: (gameId: number, payload: { title?: string; status?: string; totalQuestions?: number }) =>
        api.update(gameId, payload),
    remove: (gameId: number) => api.remove(gameId),
    start: (gameId: number) => api.start(gameId),
    end: (gameId: number) => api.end(gameId),
    results: (gameId: number, playerId: number) => api.results(gameId, playerId),
};