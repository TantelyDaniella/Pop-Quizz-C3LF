import { GameApi } from "../api/user.game.api";

const api = GameApi();

export const GameService = {
    joinGame: (gameId: number, playerId: number) =>
        api.joinGame(gameId, playerId),

    submitAnswer: (gameId: number, questionId: number, playerId: number, answer: string, answerValue?: string) =>
        api.submitAnswer(gameId, questionId, { playerId, answer, answerValue }),
};