import {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Loader2, List } from "lucide-react";

import LiveQuestion, {
  type Answer,
} from "../components/LiveQuestion";
import AdminGameResults from "../components/AdminGameResult";
import ConfirmModal from "../components/ConfirmationModal";

import { SocketContext } from "../../../app/context/SocketContext";
import { useOpenNextQuestion, useShowLeaderboard } from "../hooks/useGame";
import { useQuizById, useStartQuiz,useEndQuiz } from "../hooks/useQuiz";

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

interface OpenQuestionError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export default function QuizLivePage() {
  const { gameId, roundNumber } = useParams();
  const navigate = useNavigate();
  const openingQuestionRef = useRef(false);
  const [questionReceivedAt, setQuestionReceivedAt] = useState<number>(0);
  const socket = useContext(SocketContext);

  const numericGameId = Number(gameId);

  // --- Infos du quiz (titre, total de questions) ---
  const {
    quiz,
    isLoading: isQuizLoading,
    error: quizError,
  } = useQuizById(numericGameId);

  // --- Démarrage du quiz ---
  const { startQuiz, isPending: isStarting } = useStartQuiz();
  const [showStartRoundModal, setShowStartRoundModal] = useState(false);

  // --- Ouverture / fin de question ---
  const {
    openNextQuestion,
    isPending: isOpeningQuestion,
  } = useOpenNextQuestion();

  const { endQuiz, isPending: isEndingQuiz } = useEndQuiz();
  const { showLeaderboard, isPending: isShowingLeaderboard } = useShowLeaderboard();

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
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Le quiz a-t-il déjà démarré ? (une question a déjà été ouverte au moins une fois)
  const [hasStarted, setHasStarted] = useState(false);

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
      setHasStarted(true);
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
   * Démarrer le quiz (round 1) — remplace QuizLivePage
   * =====================================================
   */

  const handleStartQuiz = () => {
    if (!gameId || Number.isNaN(numericGameId)) {
      return;
    }

    startQuiz(numericGameId, {
      onSuccess: () => {
        setShowStartRoundModal(false);
        // Le quiz a démarré côté backend, il reste à ouvrir la première question
        handleOpenQuestion();
      },
      onError: (error: unknown) => {
        console.error("Erreur lors du démarrage du quiz :", error);
      },
    });
  };

  /*
   * =====================================================
   * Ouvrir une question
   * =====================================================
   */

  const handleOpenQuestion = () => {
    if (!gameId || !isSocketReady) {
      return;
    }

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
   * Terminer le quiz explicitement (bouton "Voir le résultat")
   * =====================================================
   */

  const handleEndQuiz = () => {
    if (!gameId || Number.isNaN(numericGameId)) {
      return;
    }

    endQuiz(numericGameId, {
      onSuccess: () => {
        console.log("✅ Quiz terminé");
        setQuestion(null);
        setIsQuizFinished(true);
      },
      onError: (error: unknown) => {
        console.error("❌ Erreur end-quiz", error);
      },
    });
  };

  const handleBackToLobby = () => {
    navigate("/lobby"); // ⚠️ route à confirmer
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
  const totalQuestionsGlobal = quiz?.totalQuestions ?? 0;

  /*
   * =====================================================
   * États de garde (chargement / erreur du quiz)
   * =====================================================
   */

  if (!gameId || Number.isNaN(numericGameId)) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">Quiz introuvable</h1>
            <p className="mt-2 text-slate-500">L'identifiant du quiz est invalide.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-slate-500">Chargement du quiz...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizError) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">Impossible de charger le quiz</h1>
            <p className="mt-2 text-slate-500">Une erreur est survenue lors de la récupération des informations du quiz.</p>
          </div>
        </div>
      </div>
    );
  }

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
            {quiz?.title ?? "Quiz en direct"}
          </h1>

          <p className="mt-2 text-slate-500">
            Game #{gameId} · Round {roundNumber}
          </p>
        </div>

        {/* Résultats finaux */}
        {isQuizFinished && (
          <div className="space-y-4">
            <AdminGameResults
              gameId={numericGameId}
              onBackToLobby={handleBackToLobby}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => showLeaderboard(numericGameId)}
                disabled={isShowingLeaderboard}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isShowingLeaderboard ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <List className="h-5 w-5" />
                )}
                Afficher les leaderboards des participants
              </button>
            </div>
          </div>
        )}

        {/* Quiz pas encore démarré : écran "Prêt à commencer" (ex-QuizLivePage) */}
        {!hasStarted && !isQuizFinished && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {quiz?.title ?? "Quiz"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Prêt à commencer
                </p>
              </div>
              <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-600">
                En attente
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Questions</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalQuestionsGlobal}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Round actuel</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  0 / {totalQuestionsGlobal}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Participants</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowStartRoundModal(true)}
                disabled={isStarting || !isSocketReady}
                className="inline-flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isSocketReady ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isStarting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Play size={20} />
                )}
                {!isSocketReady
                  ? "Connexion..."
                  : isStarting
                  ? "Démarrage..."
                  : "Commencer le round 1"}
              </button>
            </div>
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
            isOpeningNext={isOpeningQuestion}
            isEndingQuiz={isEndingQuiz}
            onNext={handleOpenQuestion}
            onEndQuiz={handleEndQuiz}
          />
        )}

      </div>

      <ConfirmModal
        open={showStartRoundModal}
        title="Commencer le round 1 ?"
        message="Voulez-vous vraiment commencer le premier round ? Les participants pourront alors commencer à jouer."
        confirmLabel="Commencer le round"
        cancelLabel="Annuler"
        variant="warning"
        isLoading={isStarting}
        onCancel={() => setShowStartRoundModal(false)}
        onConfirm={handleStartQuiz}
      />
    </div>
  );
}