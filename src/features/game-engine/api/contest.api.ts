import createClient from "@/lib/api.client";

export const ContestApi = () => {
  const client = createClient("game");
  return {
    list: () => client.get(""),
    getById: (id: number) => client.get(`${id}`),
    join: (id: number, playerId: number) => client.post(`${id}/join`, { playerId }),
    submitAnswer: (
      gameId: number,
      questionId: number,
      payload: { answer: string }
    ) => client.post(`${gameId}/questions/${questionId}/submit-answer`, payload),
    openNextQuestion: (gameId: number) =>
      client.post(`${gameId}/open-next-question`),

    leaderboardMe: (gameId: number) =>
      client.get(`${gameId}/leaderboard/me`),
  };
};
