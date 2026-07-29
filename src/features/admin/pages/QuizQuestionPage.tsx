import {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams } from "react-router-dom";

import LiveQuestion, {
  type Answer,
} from "../components/LiveQuestion";

import { SocketContext } from "../../context/SocketContext";
import { useOpenNextQuestion } from "../../hooks/admin/useGame";

interface QuestionData {
  contestQuestionId: number;
  gameId: number;
  questionId: number;
  category: string;
  choices: Answer[]; // ⚠️ à confirmer une fois la structure de choices connue
  closedAt: string | null;
  correctAnswer: string;
  duration: number;
  explanation: string;
  openedAt: string;
  orderIndex: number;
  points: number;
  roundNumber: number;
  statement: string;
  status: string;
  type: string;
}

interface QuestionOpenedPayload {
  question: QuestionData;
}

interface QuestionClosedPayload {
  contestQuestionId: number;
  correctAnswer: string | unknown[] | object;
  // ⚠️ Le backend n'envoie pas toujours ce champ actuellement
  progress?: {
    answeredCount: number;
    totalParticipants: number;
  };
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
  const [questionReceivedAt, setQuestionReceivedAt] = useState<number>(0);
  const socket = useContext(SocketContext);

  const {
    openNextQuestion,
    isPending: isOpeningQuestion,
  } = useOpenNextQuestion();

  const [question, setQuestion] =
    useState<QuestionData | null>(null);

  const [stats, setStats] =
    useState<AnswerStatsPayload>({
      answeredPlayers: 0,
      totalPlayers: 0,
      correctPercentage: 0,
      incorrectPercentage: 0,
    });

  const [isSocketReady, setIsSocketReady] = useState(false);

  const numericGameId = Number(gameId);

  /*
   * =====================================================
   * Rejoindre la room de la partie (game:{gameId})
   *
   * ⚠️ Le backend attend l'ID directement, pas un objet
   * (src/server.js:35 → socket.on("join-game", (gameId) => ...))
   * =====================================================
   */

  useEffect(() => {
    if (!socket || !gameId) {
      return;
    }

    if (Number.isNaN(numericGameId)) {
      console.error("Game ID invalide");
      return;
    }

    const joinGame = () => {
      console.log("👤 Admin rejoint la game :", numericGameId);

      socket.emit("join-game", numericGameId);

      setIsSocketReady(true);
    };

    if (socket.connected) {
      joinGame();
    } else {
      setIsSocketReady(false);
    }

    socket.on("connect", joinGame);

    return () => {
      socket.off("connect", joinGame);
    };
  }, [socket, gameId, numericGameId]);

  /*
   * =====================================================
   * Question ouverte : "question:opened"
   * =====================================================
   */

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleQuestionOpened = (
      data: QuestionOpenedPayload
    ) => {
      console.log("🔥 QUESTION REÇUE (question:opened) :", data);

      setQuestion(data.question);
      setQuestionReceivedAt(Date.now());
      openingQuestionRef.current = false;

      setStats({
        answeredPlayers: 0,
        totalPlayers: 0,
        correctPercentage: 0,
        incorrectPercentage: 0,
      });
    };

    socket.on("question:opened", handleQuestionOpened);

    return () => {
      socket.off("question:opened", handleQuestionOpened);
    };
  }, [socket]);

  /*
   * =====================================================
   * Fermeture de question : "question:closed"
   *
   * ⚠️ Le backend n'envoie pas toujours "progress" pour le
   * moment (observé : { contestQuestionId, correctAnswer }
   * seulement) — on sécurise l'accès.
   * =====================================================
   */

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleQuestionClosed = (
      data: QuestionClosedPayload
    ) => {
      console.log("📊 QUESTION FERMÉE (question:closed) :", data);

      if (!data.progress) {
        console.warn(
          "⚠️ question:closed reçu sans champ 'progress' — stats non mises à jour"
        );
        return;
      }

      setStats((prev) => ({
        ...prev,
        answeredPlayers: data.progress!.answeredCount,
        totalPlayers: data.progress!.totalParticipants,
      }));
    };

    socket.on("question:closed", handleQuestionClosed);

    return () => {
      socket.off("question:closed", handleQuestionClosed);
    };
  }, [socket]);

  /*
   * =====================================================
   * DEBUG TEMPORAIRE (à retirer une fois validé)
   * =====================================================
   */

  useEffect(() => {
    if (!socket) {
      return;
    }

    const logAny = (event: string, ...args: unknown[]) => {
      console.log("📩 EVENT REÇU :", event, args);
    };

    socket.onAny(logAny);

    return () => {
      socket.offAny(logAny);
    };
  }, [socket]);

  /*
   * =====================================================
   * Ouvrir une question
   * =====================================================
   */

  const handleOpenQuestion = () => {
    if (!gameId || !isSocketReady) {
      return;
    }

    const numericGameId = Number(gameId);

    if (Number.isNaN(numericGameId)) {
      return;
    }

    if (openingQuestionRef.current) {
      console.log("⏳ Ouverture déjà en cours...");
      return;
    }

    openingQuestionRef.current = true;

    console.log(
      "➡️ Ouverture de la question du quiz",
      numericGameId
    );

    openNextQuestion(numericGameId, {
      onSuccess: () => {
        console.log("✅ Requête open-next-question réussie");
      },

      onError: () => {
        openingQuestionRef.current = false;
      },
    });
  };

  /*
   * =====================================================
   * Interface
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Quiz en direct
          </h1>

          <p className="mt-2 text-slate-500">
            Game #{gameId} · Round {roundNumber}
          </p>
        </div>

        {/* Aucune question ouverte */}
        {!question && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold">
              Prêt à commencer
            </h2>

            <p className="mt-2 text-slate-500">
              Ouvrez la première question pour
              commencer le round.
            </p>

            <button
              type="button"
              onClick={handleOpenQuestion}
              disabled={isOpeningQuestion || !isSocketReady}
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(isOpeningQuestion || !isSocketReady) && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}

              {!isSocketReady
                ? "Connexion..."
                : isOpeningQuestion
                ? "Ouverture..."
                : "Ouvrir la question 1"}
            </button>

          </div>
        )}

        {/* Question active */}
        {question && (
          <LiveQuestion
            questionNumber={question.orderIndex}
            totalQuestions={10} // ⚠️ absent du payload, à récupérer autrement — voir note
            question={question.statement}
            answers={question.choices}
            duration={question.duration}
            startedAt={questionReceivedAt}
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