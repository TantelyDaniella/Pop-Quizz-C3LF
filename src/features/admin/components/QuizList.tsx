import { Pencil, Trash2, Play, Square, Eye, Trophy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModal";
import { useQuiz, useDeleteQuiz } from "../hooks/useQuiz";
import type { Quiz } from "../types/quiz";
import EditQuizForm from "./EditQuizForm";

type Props = { category?: string; search?: string };

export default function QuizList({ category, search = "" }: Props) {
  const { quizzes, isLoading, error } = useQuiz();
  const { deleteQuiz, isPending: isDeleting } = useDeleteQuiz();
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);
  const [quizToStart, setQuizToStart] = useState<Quiz | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center py-10"><p className="text-sm text-gray-500">Chargement des quiz...</p></div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4"><p className="text-sm text-red-600">Une erreur est survenue lors du chargement des quiz.</p></div>;
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = !category || quiz.status === category;
    const searchValue = search.toLowerCase().trim();
    const matchesSearch = !searchValue || quiz.title.toLowerCase().includes(searchValue);
    return matchesCategory && matchesSearch;
  });

  const formatStatus = (status: string) => {
    const map: Record<string, string> = { waiting: "En attente", running: "En cours", finished: "Terminé" };
    return map[status] ?? status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      waiting: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      running: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      finished: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return map[status] ?? "bg-slate-700 text-slate-300 border border-slate-600";
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Quiz</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Statut</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">Questions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">Créé le</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <tr key={quiz.gameId} className="transition-colors hover:bg-slate-800">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{quiz.title}</p>
                    <p className="mt-1 text-xs text-slate-500">ID : #{quiz.gameId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(quiz.status)}`}>{formatStatus(quiz.status)}</span>
                  </td>
                  <td className="px-6 py-4 text-center"><span className="text-sm font-medium text-white">{quiz.totalQuestions}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-300">{formatDate(quiz.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {quiz.status === "waiting" && (
                        <>
                          <button type="button" onClick={() => setQuizToEdit(quiz)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                            <Pencil size={16} /> Modifier
                          </button>
                          <button type="button" onClick={() => setQuizToStart(quiz)}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
                            <Play size={16} /> Lancer
                          </button>
                          <button type="button" onClick={() => setQuizToDelete(quiz)}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
                            <Trash2 size={16} /> Supprimer
                          </button>
                        </>
                      )}
                      {quiz.status === "running" && (
                        <>
                          <button type="button" onClick={() => console.log("Voir le quiz :", quiz.gameId)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                            <Eye size={16} /> Voir
                          </button>
                          <button type="button" onClick={() => console.log("Terminer le quiz :", quiz.gameId)}
                            className="flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700">
                            <Square size={16} /> Terminer
                          </button>
                        </>
                      )}
                      {quiz.status === "finished" && (
                        <button type="button" onClick={() => console.log("Voir les résultats :", quiz.gameId)}
                          className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                          <Trophy size={16} /> Résultats
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">Aucun quiz trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4">
        <span className="text-sm text-white">Total : <span className="font-semibold text-white">{filteredQuizzes.length}</span> quiz{filteredQuizzes.length > 1 ? "s" : ""}</span>
      </div>

      <ConfirmModal
        open={quizToDelete !== null}
        title="Supprimer le quiz ?"
        message={quizToDelete ? `Voulez-vous vraiment supprimer le quiz « ${quizToDelete.title} » ? Cette action est irréversible.` : ""}
        confirmLabel="Supprimer" cancelLabel="Annuler" variant="danger" isLoading={isDeleting}
        onCancel={() => setQuizToDelete(null)}
        onConfirm={() => {
          if (!quizToDelete) return;
          deleteQuiz(quizToDelete.gameId, {
            onSuccess: () => { toast.success("Quiz supprimé avec succès !"); setQuizToDelete(null); },
            onError: () => { toast.error("Impossible de supprimer le quiz."); },
          });
        }}
      />

      <ConfirmModal
        open={quizToStart !== null}
        title="Ouvrir le quiz ?"
        message={quizToStart ? `Voulez-vous ouvrir le quiz « ${quizToStart.title} » dans une nouvelle fenêtre ? Vous pourrez ensuite démarrer le premier round depuis cette fenêtre.` : ""}
        confirmLabel="Ouvrir le quiz" cancelLabel="Annuler" variant="warning"
        onCancel={() => setQuizToStart(null)}
        onConfirm={() => {
          if (!quizToStart) return;
          const gameId = quizToStart.gameId;
          const liveWindow = window.open(`/admin/quiz/${gameId}/live`, "_blank", "width=1200,height=800");
          if (!liveWindow) {
            toast.error("La fenêtre a été bloquée par le navigateur. Autorisez les popup pour ce site.");
            return;
          }
          setQuizToStart(null);
        }}
      />

      {quizToEdit && <EditQuizForm quiz={quizToEdit} onClose={() => setQuizToEdit(null)} />}
    </div>
  );
}
