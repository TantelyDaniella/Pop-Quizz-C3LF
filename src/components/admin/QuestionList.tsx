import { Pencil, Trash2 } from "lucide-react";
import { useQuestion, useDeleteQuestion } from "../../hooks/admin/useQuestion";
import { useState } from "react";
import type { Question } from "../../types/question";
import ConfirmModal from "../common/ConfirmationModal";
import { toast } from "sonner";
export default function QuestionList() {
  const {
    questions,
    isLoading,
    error,
  } = useQuestion();

  const {
      deleteQuestion,
      isPending: isDeleting,
    } = useDeleteQuestion();

  const [questionToDelete, setQuestionToDelete] =
    useState<Question | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-gray-500">
          Chargement des questions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Une erreur est survenue lors du chargement des questions.
        </p>
      </div>
    );
  }

  const formatCategory = (category: string) => {
    const categories: Record<string, string> = {
      culture_generale: "Culture générale",
      commandes_linux: "Commandes Linux",
      programmation_shell: "Programmation Shell",
    };

    return categories[category] ?? category;
  };

  const formatType = (type: string) => {
    const types: Record<string, string> = {
      multiple_choice: "Choix multiple",
      command_input: "Saisie de commande",
      command_combination: "Combinaison",
      command_completion: "Complétion",
      shell_programming: "Programmation Shell",
    };

    return types[type] ?? type;
  };

  const formatDifficulty = (difficulty: string) => {
    const difficulties: Record<string, string> = {
      easy: "Facile",
      medium: "Moyenne",
      hard: "Difficile",
    };

    return difficulties[difficulty] ?? difficulty;
  };

  const handleEdit = (questionId: number) => {
    console.log("Modifier la question :", questionId);
  };


  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Question
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Catégorie
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Type
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Difficulté
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Durée
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Points
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr
                  key={question.questionId}
                  className="transition-colors hover:bg-slate-800"
                >
                  {/* Question */}
                  <td className="max-w-md px-6 py-4">
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {question.statement}
                    </p>
                  </td>

                  {/* Catégorie */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
                      {formatCategory(question.category)}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {formatType(question.type)}
                  </td>

                  {/* Difficulté */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
                      {formatDifficulty(question.difficulty)}
                    </span>
                  </td>

                  {/* Durée */}
                  <td className="px-6 py-4 text-center text-sm text-slate-300">
                    {question.duration}s
                  </td>

                  {/* Points */}
                  <td className="px-6 py-4 text-center text-sm font-medium text-white">
                    {question.points}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(question.questionId)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <Pencil size={16} />
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuestionToDelete(question)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  Aucune question trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={questionToDelete !== null}
        title="Supprimer la question ?"
        message={
          questionToDelete
            ? `Voulez-vous vraiment supprimer cette question ? Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        isLoading={isDeleting}
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={() => {
          if (!questionToDelete) return;

          deleteQuestion(questionToDelete.questionId, {
            onSuccess: () => {
              toast.success("Question supprimée avec succès !");
              setQuestionToDelete(null);
            },
            onError: () => {
              toast.error("Impossible de supprimer la question.");
            },
          });
        }}
      />
    </div>
  );
}