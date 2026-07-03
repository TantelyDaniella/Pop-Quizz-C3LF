import createClient from "../modules/api.client";

export const GameApi = () => {
    const client = createClient("game");

    return {
        joinGame: (gameId: number, playerId: number) =>
            client.post(`${gameId}/join`, { playerId }),

        submitAnswer: (gameId: number, questionId: number, payload: { playerId: number; answer: string; answerValue?: string }) =>
            client.post(`${gameId}/questions/${questionId}/submit-answer`, payload),
    };
};