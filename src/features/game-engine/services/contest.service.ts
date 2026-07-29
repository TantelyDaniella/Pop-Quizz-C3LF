import { ContestApi } from "../api/contest.api";
import { mockContests } from "../mocks/contest.mock";
import type { LeaderboardEntry } from "../types/game.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const api = ContestApi();

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { gameId: 1, playerId: 1, username: "alice",   avatarUrl: "https://api.dicebear.com/10.x/bottts/svg?seed=alice",   score: 100, correctAnswers: 10, wrongAnswers: 0, firstBloodCount: 3, avgResponseTime: 2.1, rank: 1 },
  { gameId: 1, playerId: 2, username: "bob",     avatarUrl: "https://api.dicebear.com/10.x/bottts/svg?seed=bob",     score: 80,  correctAnswers: 8,  wrongAnswers: 2, firstBloodCount: 1, avgResponseTime: 3.4, rank: 2 },
  { gameId: 1, playerId: 3, username: "charlie", avatarUrl: "https://api.dicebear.com/10.x/bottts/svg?seed=charlie", score: 60,  correctAnswers: 6,  wrongAnswers: 4, firstBloodCount: 0, avgResponseTime: 5.2, rank: 3 },
];

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

  getLeaderboard: async (gameId: number): Promise<LeaderboardEntry[]> => {
    const res = USE_MOCK
      ? MOCK_LEADERBOARD
      : (await api.leaderboard(gameId)) as { data: LeaderboardEntry[] };
    return Array.isArray(res) ? res : res.data ?? [];
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
