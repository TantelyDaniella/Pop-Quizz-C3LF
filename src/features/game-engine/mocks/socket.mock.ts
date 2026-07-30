import { mockContests, mockQuestions } from "./contest.mock";

type EventCallback = (data: unknown) => void;
const listeners: Record<string, EventCallback[]> = {};
const timers: ReturnType<typeof setTimeout>[] = [];

const emit = (event: string, data: unknown) => {
  listeners[event]?.forEach((cb) => cb(data));
};

function clearTimers() {
  timers.splice(0).forEach(clearTimeout);
}

function runGameLoop() {
  const totalQuestions = mockQuestions.length;
  let qIndex = 0;

  const scheduleNext = () => {
    if (qIndex >= totalQuestions) {
      timers.push(setTimeout(() => emit("game:ended", {
        game: { gameId: 1, status: "finished", title: "Linux Battle #1" },
      }), 2000));
      timers.push(setTimeout(() => emit("show-leaderboard", { gameId: 1 }), 4000));
      return;
    }

    const q = mockQuestions[qIndex];
    emit("question:opened", { question: q });

    timers.push(
      setTimeout(() => {
        emit("question:closed", {
          contestQuestionId: q.contestQuestionId,
          correctAnswer: q.correctAnswer,
          progress: { answeredCount: 3, totalParticipants: 4 },
        });

        qIndex++;
        timers.push(setTimeout(scheduleNext, 3000));
      }, q.duration * 1000)
    );
  };

  timers.push(setTimeout(() => emit("game:started", {
    game: { gameId: 1, status: "running", title: "Linux Battle #1", totalQuestions },
  }), 2000));
  timers.push(setTimeout(scheduleNext, 4000));
}

export const mockSocket = {
  on: (event: string, cb: EventCallback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
  },
  off: (event: string, cb: EventCallback) => {
    listeners[event] = listeners[event]?.filter((fn) => fn !== cb) ?? [];
  },
  emit: (event: string, payload?: unknown) => {
    if (event === "join-lobby") {
      timers.push(setTimeout(() => {
        emit("created-game", { game: mockContests[0] });
      }, 200));
      timers.push(setTimeout(() => {
        emit("created-game", { game: mockContests[1] });
      }, 400));
      timers.push(setTimeout(() => emit("updated-game", { updatedGame: { ...mockContests[1], status: "running" } }), 3000));
    }

    if (event === "join-game") {
      const gameId = (payload as { gameId?: number })?.gameId ?? 1;
      emit("game:participant-joined", {
        participant: { playerId: 1, gameId, joinedAt: new Date().toISOString() },
      });
      runGameLoop();
    }
  },
  disconnect: () => {
    clearTimers();
  },
};
