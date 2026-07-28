import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import LiveQuestion, { type Answer } from "../components/LiveQuestion";
import { SocketContext } from "../../../app/context/SocketContext";
import { useOpenNextQuestion } from "../hooks/useGame";

interface QuestionStartedPayload {
  questionId: number;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: Answer[];
  duration: number;
  startedAt: number;
}

interface AnswerStatsPayload {
  answeredPlayers: number;
  totalPlayers: number;
  correctPercentage: number;
  incorrectPercentage: number;
}

export default function QuizQuestionPage() {
  const { gameId, roundNumber } = useParams();
  const openingQuestionRef = useRef(false);
  const socket = useContext(SocketContext);
  const { openNextQuestion, isPending: isOpeningQuestion } = useOpenNextQuestion();

  const [question, setQuestion] = useState<QuestionStartedPayload | null>(null);
  const [stats, setStats] = useState<AnswerStatsPayload>({ answeredPlayers: 0, totalPlayers: 0, correctPercentage: 0, incorrectPercentage: 0 });

  const numericGameId = Number(gameId);

  useEffect(() => {
    if (!socket || !gameId) return;
    if (Number.isNaN(numericGameId)) { console.error("Game ID invalide"); return; }

    const joinQuiz = () => {
      socket.emit("join_quiz", { gameId: numericGameId, role: "admin" });
    };

    if (socket.connected) joinQuiz();
    socket.on("connect", joinQuiz);

    return () => { socket.off("connect", joinQuiz); };
  }, [socket, gameId, numericGameId]);

  useEffect(() => {
    if (!socket) return;

    const handleQuestionStarted = (data: QuestionStartedPayload) => {
      setQuestion(data);
      openingQuestionRef.current = false;
      setStats({ answeredPlayers: 0, totalPlayers: 0, correctPercentage: 0, incorrectPercentage: 0 });
    };

    const handleAnswerStatsUpdated = (data: AnswerStatsPayload) => {
      setStats(data);
    };

    socket.on("question_started", handleQuestionStarted);
    socket.on("answer_stats_updated", handleAnswerStatsUpdated);

    return () => {
      socket.off("question_started", handleQuestionStarted);
      socket.off("answer_stats_updated", handleAnswerStatsUpdated);
    };
  }, [socket]);

  const handleOpenQuestion = () => {
    if (!gameId) return;
    const numId = Number(gameId);
    if (Number.isNaN(numId)) return;
    if (openingQuestionRef.current) return;

    openingQuestionRef.current = true;

    openNextQuestion(numId, {
      onSuccess: () => {},
      onError: () => { openingQuestionRef.current = false; },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz en direct</h1>
          <p className="mt-2 text-slate-500">Game #{gameId} · Round {roundNumber}</p>
        </div>

        {!question && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Prêt à commencer</h2>
            <p className="mt-2 text-slate-500">Ouvrez la première question pour commencer le round.</p>
            <button
              type="button"
              onClick={handleOpenQuestion}
              disabled={isOpeningQuestion}
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOpeningQuestion && <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {isOpeningQuestion ? "Ouverture..." : "Ouvrir la question 1"}
            </button>
          </div>
        )}

        {question && (
          <LiveQuestion
            questionNumber={question.questionNumber}
            totalQuestions={question.totalQuestions}
            question={question.question}
            answers={question.answers}
            duration={question.duration}
            startedAt={question.startedAt}
            answeredPlayers={stats.answeredPlayers}
            totalPlayers={stats.totalPlayers}
            correctPercentage={stats.correctPercentage}
            incorrectPercentage={stats.incorrectPercentage}
            onNext={handleOpenQuestion}
          />
        )}
      </div>
    </div>
  );
}
