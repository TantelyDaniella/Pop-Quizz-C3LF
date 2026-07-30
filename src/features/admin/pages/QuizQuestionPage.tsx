import {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";

import LiveQuestion, {
  type Answer,
} from "../components/LiveQuestion";
import AdminGameResults from "../components/AdminGameResult";

import { SocketContext } from "../../../app/context/SocketContext";
import { useOpenNextQuestion } from "../hooks/useGame";
import { useEndQuiz } from "../hooks/useQuiz";

interface QuestionData {
  contestQuestionId: number;
  gameId: number;
  questionId: number;
  category: string;
  choices: Answer[];
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
  totalQuestions?: number;
}

interface QuestionClosedPayload {
  contestQuestionId: number;
  correctAnswer: string | unknown[] | object;
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

// ⚠️ Forme supposée de l'erreur renvoyée par useOpenNextQuestion.
// À ajuster selon la vraie structure exposée dans onError.
interface OpenQuestionError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export default function QuizQuestionPage() {
  const { gameId, roundNumber } = useParams();
  const navigate = useNavigate();
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
  const [totalQuestionsGlobal, setTotalQuestionsGlobal] = useState(4);

  // Passe à true quand le backend signale qu'il n'y a plus de question
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const numericGameId = Number(gameId);


  /*
   * =====================================================
   * Rejoindre la room de la partie (game:{gameId})
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

      if (typeof data.totalQuestions === "number") {
        setTotalQuestionsGlobal(data.totalQuestions);
      }

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

      onError: (error: OpenQuestionError) => {
        openingQuestionRef.current = false;

        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        // Plus de question en attente => le quiz est terminé
        if (
          status === 404 &&
          message === "Aucune question en attente."
        ) {
          console.log("🏁 Plus de question en attente, quiz terminé.");
          setQuestion(null);
          setIsQuizFinished(true);
          return;
        }

        console.error(
          "❌ Erreur open-next-question inattendue",
          error
        );
      },
    });
  };

  /*
   * =====================================================
   * Compteur global continu de questions
   * =====================================================
   */

  const globalQuestionNumberRef = useRef(0);
  const lastQuestionIdRef = useRef<number | null>(null);

  if (
    question &&
    lastQuestionIdRef.current !== question.questionId
  ) {
    globalQuestionNumberRef.current += 1;
    lastQuestionIdRef.current = question.questionId;
  }

  const globalQuestionNumber = globalQuestionNumberRef.current;

  const handleBackToLobby = () => {
    navigate("/lobby"); // ⚠️ route à confirmer
  };


const { endQuiz, isPending: isEndingQuiz } = useEndQuiz();

// ...

const handleEndQuiz = () => {
  if (!gameId) {
    return;
  }

  const numericGameId = Number(gameId);

  if (Number.isNaN(numericGameId)) {
    return;
  }

  endQuiz(numericGameId, {
    onSuccess: () => {
      console.log("✅ Quiz terminé");
      setQuestion(null);
      setIsQuizFinished(true);
    },
    onError: (error) => {
      console.error("❌ Erreur end-quiz", error);
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

        {/* Résultats finaux */}
        {isQuizFinished && (
          <AdminGameResults
            gameId={numericGameId}
          />
        )}

        {/* Aucune question ouverte (et quiz pas encore terminé) */}
        {!question && !isQuizFinished && (
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
        {question && !isQuizFinished && (
          <LiveQuestion
            questionNumber={globalQuestionNumber}
            totalQuestions={totalQuestionsGlobal}
            totalQuestionsGlobal={totalQuestionsGlobal}
            question={question.statement}
            answers={question.choices}
            correctAnswer={question.correctAnswer}
            duration={question.duration}
            startedAt={questionReceivedAt}
            answeredPlayers={stats.answeredPlayers}
            totalPlayers={stats.totalPlayers}
            correctPercentage={stats.correctPercentage}
            incorrectPercentage={stats.incorrectPercentage}
            onNext={handleOpenQuestion}
            onEndQuiz={handleEndQuiz}
          />
        )}

      </div>
    </div>
  );
}