import { ContestApi } from "../api/contest.api";
import { mockContests } from "../mocks/contest.mock";
import type { LeaderboardEntry } from "../types/game.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const api = ContestApi();

export const ContestService = {
  list: () =>
    USE_MOCK ? Promise.resolve(mockContests) : api.list(),

  getById: (id: number) =>
    USE_MOCK
      ? Promise.resolve(mockContests.find((c) => c.id === id))
      : api.getById(id),

  join: (id: number, playerId: number) =>
    USE_MOCK
      ? Promise.resolve({ id, playerId })
      : api.join(id, playerId),

  getMyLeaderboard: async (gameId: number) => {
    console.log("getMyLeaderboard request:", { gameId });
    const res = USE_MOCK
      ? {
          gameId,
          playerId: 1,
          username: "mock_user",
          avatarUrl: "https://api.dicebear.com/10.x/bottts/svg?seed=Felix",
          score: 25,
          correctAnswers: 2,
          wrongAnswers: 1,
          firstBloodCount: 0,
          avgResponseTime: 8.5,
          rank: 3,
        }
      : (await api.leaderboardMe(gameId)) as { data: LeaderboardEntry[] };
    const entry = Array.isArray(res) ? res[0] : (res as { data: LeaderboardEntry[] }).data?.[0] ?? res;
    console.log("getMyLeaderboard response:", entry);
    return entry;
  },

  submitAnswer: async (
    gameId: number,
    questionId: number,
    payload: { answer: string }
  ) => {
    console.log("submitAnswer request:", { gameId, questionId, payload });
    const res = await api.submitAnswer(gameId, questionId, payload);
    console.log("submitAnswer response:", res);
    return res;
  },
};
