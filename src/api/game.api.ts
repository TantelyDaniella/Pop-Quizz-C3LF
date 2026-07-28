// api/game.api.ts

import createClient from "../modules/api.client";

const client = createClient("game");

export const GameApi = {
  openNextQuestion: (gameId: number) =>
    client.post(`${gameId}/open-next-question`, {}),

  submitAnswer: (
    gameId: number,
    questionId: number,
    answerId: number
  ) =>
    client.post(
      `${gameId}/questions/${questionId}/submit-answer`,
      {
        answerId,
      }
    ),

  getQuestionStats: (
    gameId: number,
    questionId: number
  ) =>
    client.get(
      `${gameId}/questions/${questionId}/stats`
    ),

  getLeaderboard: (gameId: number) =>
    client.get(`${gameId}/leaderboard`),
};