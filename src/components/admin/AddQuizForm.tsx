
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Portal } from "../common/Portal";
import { useCreateQuiz } from "../../hooks/admin/useQuiz";
import type { CreateQuizPayload } from "../../types/quiz";

type AddQuizFormProps = {
  onClose: () => void;
};

type FormData = {
  title: string;
  totalQuestions: number;
};

type FormErrors = {
  title?: string;
  totalQuestions?: string;
};

export default function AddQuizForm({
  onClose,
}: AddQuizFormProps) {
  const { createQuiz } = useCreateQuiz();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    totalQuestions: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    field: keyof FormData,
    value: string | number
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre du quiz est obligatoire.";
    }

    if (formData.totalQuestions <= 0) {
      newErrors.totalQuestions =
        "Le nombre de questions doit être supérieur à 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = () => {
    if (!validateForm()) {
        return;
    }

    const creator = Number(localStorage.getItem("id")) || 1;

    const payload: CreateQuizPayload = {
        title: formData.title.trim(),
        totalQuestions: formData.totalQuestions,
        createdBy: creator,
    };

    console.log("Payload quiz :", payload);

    createQuiz(payload, {
        onSuccess: () => {
        toast.success("Quiz créé avec succès !");
        onClose();
        },

        onError: () => {
        toast.error(
            "Une erreur est survenue lors de la création du quiz."
        );
        },
    });
    };



  return (
    <Portal>
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ajouter un quiz
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Informations générales du quiz
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENU */}
          <div className="flex flex-col gap-5 p-6">

            {/* TITRE */}
            <div>
              <label
                htmlFor="quiz-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Titre du quiz
              </label>

              <input
                id="quiz-title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                placeholder="Ex : Quiz Linux niveau débutant"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

            {/* NOMBRE DE QUESTIONS */}
            <div>
              <label
                htmlFor="quiz-total-questions"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nombre de questions
              </label>

              <input
                id="quiz-total-questions"
                type="number"
                min={1}
                value={formData.totalQuestions}
                onChange={(e) =>
                  handleChange(
                    "totalQuestions",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.totalQuestions && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.totalQuestions}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Créer le quiz
            </button>

          </div>
        </div>
      </div>
    </Portal>
  );
}
