import { useCallback, useEffect, useReducer, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContestService } from "../services/contest.service";
import useSocket from "@/features/game-engine/hooks/useSocket";
import type { GameState, Question } from "../types/game.types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Contest listing ────────────────────────────────────────────────

export type Contest = { gameId: number; title: string; status: "waiting" | "running" | "finished"; totalQuestions?: number };

const CONTEST_KEY = ["contests"];

export function useContests() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: contests = [] } = useQuery<Contest[]>({
    queryKey: CONTEST_KEY,
    queryFn: () => [],
    staleTime: Infinity,
  });

  useEffect(() => {
    socket.emit("join-lobby");

    const onCreated = ({ game }: { game: Contest }) => {
      queryClient.setQueryData<Contest[]>(CONTEST_KEY, (prev = []) =>
        prev.some(c => c.gameId === game.gameId) ? prev : [...prev, game],
      );
    };

    const onUpdated = ({ updatedGame }: { updatedGame: Contest }) => {
      queryClient.setQueryData<Contest[]>(CONTEST_KEY, (prev = []) =>
        prev.map(c => c.gameId === updatedGame.gameId ? updatedGame : c),
      );
    };

    const onStarted = ({ game }: { game: Contest }) => {
      queryClient.setQueryData<Contest[]>(CONTEST_KEY, (prev = []) =>
        prev.map(c => c.gameId === game.gameId ? { ...c, status: "running", totalQuestions: game.totalQuestions ?? c.totalQuestions } : c),
      );
    };

    const onEnded = ({ game }: { game: Contest }) => {
      queryClient.setQueryData<Contest[]>(CONTEST_KEY, (prev = []) =>
        prev.map(c => c.gameId === game.gameId ? { ...c, status: "finished" } : c),
      );
    };

    socket.on("created-game", onCreated);
    socket.on("updated-game", onUpdated);
    socket.on("game:started", onStarted);
    socket.on("game:ended", onEnded);

    return () => {
      socket.off("created-game", onCreated);
      socket.off("updated-game", onUpdated);
      socket.off("game:started", onStarted);
      socket.off("game:ended", onEnded);
    };
  }, [socket, queryClient]);

  return { contests };
}

export function useJoinContest() {
  const socket = useSocket();
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: ({ gameId, playerId }: { gameId: number; playerId: number }) =>
        ContestService.join(gameId, playerId),
    onSuccess: (_, { gameId }) => {
      socket.emit("join-game", gameId);
    },
  });
  return { join: mutate, isPending, isSuccess, error };
}

// ─── Game engine ────────────────────────────────────────────────────

type GameAction =
  | { type: "START_WAITING" }
  | { type: "GAME_STARTED" }
  | { type: "QUESTION_OPENED"; question: Question }
  | { type: "QUESTION_CLOSED"; contestQuestionId: number; correctAnswer: unknown; progress: { answeredCount: number; totalParticipants: number } }
  | { type: "GAME_ENDED" }
  | { type: "SUBMIT_ANSWER"; selectedChoiceId: number }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_DONE" }
  | { type: "SHOW_LEADERBOARD" }
  | { type: "GO_TO_LOBBY" };

const initial: GameState = {
  phase: "idle",
  game: null,
  currentQuestion: null,
  questionIndex: 0,
  contestQuestionId: null,
  correctAnswer: null,
  progress: null,
  score: 0,
  selectedChoiceId: null,
  submittedQuestionId: null,
  submitting: false,
  showLeaderboard: false,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_WAITING":
      return { ...initial, phase: "waiting" };
    case "GAME_STARTED":
      return { ...state, phase: "waiting" };
    case "QUESTION_OPENED": {
      const q = action.question;
      return {
        ...state,
        phase: "playing",
        currentQuestion: q,
        questionIndex: state.questionIndex + 1,
        contestQuestionId: q.contestQuestionId,
        correctAnswer: null,
        selectedChoiceId: null,
        submittedQuestionId: null,
        submitting: false,
      };
    }
    case "QUESTION_CLOSED": {
      const chosen = state.currentQuestion?.choices.find((c) => c.choiceId === state.selectedChoiceId);
      const correctValue = String(action.correctAnswer ?? "");
      const isCorrect = chosen?.content.toLowerCase() === correctValue.toLowerCase();
      return {
        ...state,
        phase: "review",
        contestQuestionId: action.contestQuestionId,
        correctAnswer: correctValue,
        progress: action.progress,
        score: isCorrect ? state.score + (state.currentQuestion?.points ?? 0) : state.score,
        submitting: false,
      };
    }
    case "SUBMIT_ANSWER":
      return { ...state, selectedChoiceId: action.selectedChoiceId };
    case "SUBMIT_START":
      return { ...state, submitting: true };
    case "SUBMIT_DONE":
      return { ...state, submitting: false, submittedQuestionId: state.currentQuestion?.questionId ?? null };
    case "GAME_ENDED":
      return { ...state, phase: "ended", currentQuestion: null };
    case "SHOW_LEADERBOARD":
      return { ...state, showLeaderboard: true };
    case "GO_TO_LOBBY":
      return initial;
  }
}

export function useGame() {
  const socket = useSocket();
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const onStarted = (data?: unknown) => {
      dispatch({ type: "GAME_STARTED" });
    };
    const onQuestionOpened = (data: { question: Question }) => {
      dispatch({ type: "QUESTION_OPENED", question: data.question });
    };
    const onQuestionClosed = (data: { contestQuestionId: number; correctAnswer: unknown; progress: { answeredCount: number; totalParticipants: number } }) =>
      dispatch({ type: "QUESTION_CLOSED", ...data });
    const onEnded = (data?: unknown) => {
      dispatch({ type: "GAME_ENDED" });
    };

    const onShowLeaderboard = (data: { gameId: number }) => {
      localStorage.setItem("leaderboardGameId", String(data.gameId));
      dispatch({ type: "SHOW_LEADERBOARD" });
    };

    socket.on("game:started", onStarted);
    socket.on("question:opened", onQuestionOpened);
    socket.on("question:closed", onQuestionClosed);
    socket.on("game:ended", onEnded);
    socket.on("show-leaderboard", onShowLeaderboard);

    return () => {
      socket.off("game:started", onStarted);
      socket.off("question:opened", onQuestionOpened);
      socket.off("question:closed", onQuestionClosed);
      socket.off("game:ended", onEnded);
      socket.off("show-leaderboard", onShowLeaderboard);
    };
  }, [socket]);

  const submitAnswer = useCallback((choiceId: number) => {
    dispatch({ type: "SUBMIT_ANSWER", selectedChoiceId: choiceId });
  }, []);

  const submitAnswerApi = useCallback(async () => {
    const q = state.currentQuestion;
    if (!q || state.selectedChoiceId === null) return;
    dispatch({ type: "SUBMIT_START" });

    if (!USE_MOCK) {
      const choice = q.choices.find((c) => c.choiceId === state.selectedChoiceId);
      try {
        await ContestService.submitAnswer(q.gameId, q.contestQuestionId, {
          answer: choice?.content ?? "",
        });
      } catch (e) {
        console.error("submit answer error:", e);
      }
    }
    dispatch({ type: "SUBMIT_DONE" });
  }, [state.currentQuestion, state.selectedChoiceId]);

  const goToLobby = useCallback(() => dispatch({ type: "GO_TO_LOBBY" }), []);

  return { state, submitAnswer, submitAnswerApi, goToLobby };
}
