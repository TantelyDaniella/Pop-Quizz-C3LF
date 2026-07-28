import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play } from "lucide-react";
import ConfirmModal from "../components/ConfirmationModal";
import { useQuizById, useStartQuiz } from "../hooks/useQuiz";

export default function QuizLivePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [showStartRoundModal, setShowStartRoundModal] = useState(false);
  const numericGameId = Number(gameId);

  const { quiz, isLoading: isQuizLoading, error: quizError } = useQuizById(numericGameId);
  const { startQuiz, isPending: isStarting } = useStartQuiz();

  const handleStartQuiz = () => {
    if (!gameId || Number.isNaN(numericGameId)) return;

    startQuiz(numericGameId, {
      onSuccess: () => {
        setShowStartRoundModal(false);
        navigate(`/admin/quiz/${numericGameId}/round/1`);
      },
      onError: (error) => { console.error("Erreur lors du démarrage du quiz :", error); },
    });
  };

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

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Quiz en direct</h1>
          <p className="mt-2 text-slate-500">Game #{numericGameId}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{quiz?.title ?? "Quiz"}</h2>
              <p className="mt-1 text-sm text-slate-500">Prêt à commencer</p>
            </div>
            <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-600">En attente</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Questions</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{quiz?.totalQuestions ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Round actuel</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">0 / {quiz?.totalQuestions ?? 0}</p>
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
              disabled={isStarting}
              className="flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={20} />
              {isStarting ? "Démarrage..." : "Commencer le round 1"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showStartRoundModal}
        title="Commencer le round 1 ?"
        message="Voulez-vous vraiment commencer le premier round ? Les participants pourront alors commencer à jouer."
        confirmLabel="Commencer le round" cancelLabel="Annuler" variant="warning" isLoading={isStarting}
        onCancel={() => setShowStartRoundModal(false)}
        onConfirm={handleStartQuiz}
      />
    </div>
  );
}
