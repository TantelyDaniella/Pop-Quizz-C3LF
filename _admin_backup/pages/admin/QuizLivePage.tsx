import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play } from "lucide-react";

import ConfirmModal from "../../components/common/ConfirmationModal";
import {
  useQuizById,
  useStartQuiz,
} from "../../hooks/admin/useQuiz";

export default function QuizLivePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [showStartRoundModal, setShowStartRoundModal] =
    useState(false);

  const numericGameId = Number(gameId);

  const {
    quiz,
    isLoading: isQuizLoading,
    error: quizError,
  } = useQuizById(numericGameId);

  const {
    startQuiz,
    isPending: isStarting,
  } = useStartQuiz();

  /**
   * Démarrer le quiz
   */
  console.log("on va demarrer un quiz")
  const handleStartQuiz = () => {
    if (!gameId || Number.isNaN(numericGameId)) {
      return;
    }

    startQuiz(numericGameId, {
      onSuccess: () => {
        console.log(
          `Quiz ${numericGameId} démarré`
        );

        setShowStartRoundModal(false);

        /*
         * Une fois le quiz démarré,
         * on va vers la page des questions.
         */
        navigate(
          `/admin/quiz/${numericGameId}/round/1`
        );
      },

      onError: (error) => {
        console.error(
          "Erreur lors du démarrage du quiz :",
          error
        );
      },
    });
  };

  /**
   * Game ID invalide
   */
  if (!gameId || Number.isNaN(numericGameId)) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">
              Quiz introuvable
            </h1>

            <p className="mt-2 text-slate-500">
              L'identifiant du quiz est invalide.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Chargement du quiz
   */
  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-slate-500">
                Chargement du quiz...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Erreur lors du chargement
   */
  if (quizError) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">
              Impossible de charger le quiz
            </h1>

            <p className="mt-2 text-slate-500">
              Une erreur est survenue lors de la récupération
              des informations du quiz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Quiz en direct
          </h1>

          <p className="mt-2 text-slate-500">
            Game #{numericGameId}
          </p>
        </div>

        {/* Carte principale */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Informations du quiz */}
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

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Questions */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Questions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {quiz?.totalQuestions ?? 0}
              </p>

            </div>

            {/* Round */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Round actuel
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0 / {quiz?.totalQuestions ?? 0}
              </p>

            </div>

            {/* Participants */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Participants
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                0
              </p>

            </div>

          </div>

          {/* Bouton démarrer */}
          <div className="mt-8 flex justify-center">

            <button
              type="button"
              onClick={() =>
                setShowStartRoundModal(true)
              }
              disabled={isStarting}
              className="flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={20} />

              {isStarting
                ? "Démarrage..."
                : "Commencer le round 1"}
            </button>

          </div>

        </div>
      </div>

      {/* Confirmation */}
      <ConfirmModal
        open={showStartRoundModal}
        title="Commencer le round 1 ?"
        message="Voulez-vous vraiment commencer le premier round ? Les participants pourront alors commencer à jouer."
        confirmLabel="Commencer le round"
        cancelLabel="Annuler"
        variant="warning"
        isLoading={isStarting}
        onCancel={() =>
          setShowStartRoundModal(false)
        }
        onConfirm={handleStartQuiz}
      />
    </div>
  );
}