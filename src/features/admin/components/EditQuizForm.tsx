import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Portal } from "./Portal";
import { useUpdateQuiz } from "../hooks/useQuiz";
import type { Quiz, UpdateQuizPayload } from "../types/quiz";

type Props = { quiz: Quiz; onClose: () => void };
type FormData = { title: string; totalQuestions: number };
type FormErrors = { title?: string; totalQuestions?: string };

export default function EditQuizForm({ quiz, onClose }: Props) {
  const { updateQuiz, isPending } = useUpdateQuiz();

  const [formData, setFormData] = useState<FormData>({ title: quiz.title, totalQuestions: quiz.totalQuestions });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre du quiz est obligatoire.";
    if (formData.totalQuestions <= 0) newErrors.totalQuestions = "Le nombre de questions doit être supérieur à 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const payload: UpdateQuizPayload = { title: formData.title.trim(), totalQuestions: formData.totalQuestions };

    updateQuiz({ gameId: quiz.gameId, data: payload }, {
      onSuccess: () => { toast.success("Quiz modifié avec succès !"); onClose(); },
      onError: () => { toast.error("Une erreur est survenue lors de la modification du quiz."); },
    });
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Modifier le quiz</h2>
              <p className="mt-1 text-xs text-gray-500">Modifiez les informations générales du quiz.</p>
            </div>
            <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-5 p-6">
            <div>
              <label htmlFor="quiz-title" className="mb-2 block text-sm font-medium text-gray-700">Titre du quiz</label>
              <input
                id="quiz-title" type="text" value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ex : Quiz Linux niveau débutant" disabled={isPending}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="quiz-total-questions" className="mb-2 block text-sm font-medium text-gray-700">Nombre de questions</label>
              <input
                id="quiz-total-questions" type="number" min={1} value={formData.totalQuestions}
                onChange={(e) => handleChange("totalQuestions", Number(e.target.value))} disabled={isPending}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              {errors.totalQuestions && <p className="mt-1 text-xs text-red-500">{errors.totalQuestions}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Annuler</button>
            <button type="button" onClick={handleSubmit} disabled={isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isPending ? "Modification..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
