import { GameApi } from "../api/game.api";

const api = GameApi();

export const GameService = {
  openNextQuestion: (gameId: number) =>
    api.openNextQuestion(gameId),

  submitAnswer: (
    gameId: number,
    questionId: number,
    answerId: number
  ) =>
    api.submitAnswer(gameId, questionId, answerId),

  getQuestionStats: (
    gameId: number,
    questionId: number
  ) =>
    api.getQuestionStats(gameId, questionId),

  getLeaderboard: (gameId: number) =>
    api.getLeaderboard(gameId),

  showLeaderboard: (gameId: number) =>
    api.showLeaderboard(gameId),
};