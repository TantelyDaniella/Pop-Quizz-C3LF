import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Portal } from "../common/Portal";
import {toast} from "sonner"
import type {
  QuestionChoice,
  QuestionCategory,
  QuestionType,
  QuestionDifficulty,
  CreateQuestionPayload,
} from "../../types/question";

import { useCreateQuestion } from "../../hooks/admin/useQuestion";

type AddQuestionFormProps = {
  onClose: () => void;
};

type FormData = {
  statement: string;
  category: QuestionCategory | "";
  type: QuestionType | "";
  difficulty: QuestionDifficulty | "";
  duration: number;
  points: number;
  explanation: string;
};

type FormErrors = {
  statement?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  duration?: string;
  points?: string;
  explanation?: string;
  choices?: string;
};

export default function AddQuestionForm({
  onClose,
}: AddQuestionFormProps) {
  const {
    submitQuestion,
} = useCreateQuestion(); 

  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<FormData>({
    statement: "",
    category: "",
    type: "",
    difficulty: "",
    duration: 15,
    points: 10,
    explanation: "",
  });

  const [choices, setChoices] = useState<QuestionChoice[]>([
    {
      label: "A",
      content: "",
      isCorrect: false,
    },
    {
      label: "B",
      content: "",
      isCorrect: false,
    },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});

  // ---------------------------------------------------------
  // Gestion de l'étape 1
  // ---------------------------------------------------------

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

  const validateStepOne = () => {
    const newErrors: FormErrors = {};

    if (!formData.statement.trim()) {
      newErrors.statement = "L'énoncé est obligatoire.";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est obligatoire.";
    }

    if (!formData.type) {
      newErrors.type = "Le type est obligatoire.";
    }

    if (!formData.difficulty) {
      newErrors.difficulty = "La difficulté est obligatoire.";
    }

    if (formData.duration <= 0) {
      newErrors.duration =
        "La durée doit être supérieure à 0.";
    }

    if (formData.points <= 0) {
      newErrors.points =
        "Les points doivent être supérieurs à 0.";
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStepOne()) {
      return;
    }

    setStep(2);
  };

  // ---------------------------------------------------------
  // Gestion des choix
  // ---------------------------------------------------------

  const getChoiceLabel = (index: number): string => {
    let label = "";
    let number = index + 1;

    while (number > 0) {
      const remainder = (number - 1) % 26;

      label =
        String.fromCharCode(65 + remainder) + label;

      number = Math.floor((number - 1) / 26);
    }

    return label;
  };

  const handleAddChoice = () => {
    const newChoice: QuestionChoice = {
      label: getChoiceLabel(choices.length),
      content: "",
      isCorrect: false,
    };

    setChoices((current) => [
      ...current,
      newChoice,
    ]);

    setErrors((current) => ({
      ...current,
      choices: undefined,
    }));
  };

  const handleChoiceChange = (
    index: number,
    content: string
  ) => {
    setChoices((current) =>
      current.map((choice, i) =>
        i === index
          ? {
              ...choice,
              content,
            }
          : choice
      )
    );
  };

  const handleCorrectChange = (index: number) => {
    setChoices((current) =>
      current.map((choice, i) => ({
        ...choice,
        isCorrect: i === index,
      }))
    );

    setErrors((current) => ({
      ...current,
      choices: undefined,
    }));
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length <= 2) {
      return;
    }

    setChoices((current) =>
      current
        .filter((_, i) => i !== index)
        .map((choice, i) => ({
          ...choice,
          label: getChoiceLabel(i),
        }))
    );
  };

  const validateChoices = () => {
    if (choices.length < 2) {
      setErrors({
        choices: "Ajoutez au moins deux choix.",
      });

      return false;
    }

    const emptyChoice = choices.some(
      (choice) => !choice.content.trim()
    );

    if (emptyChoice) {
      setErrors({
        choices:
          "Tous les choix doivent avoir un contenu.",
      });

      return false;
    }

    const correctChoice = choices.some(
      (choice) => choice.isCorrect
    );

    if (!correctChoice) {
      setErrors({
        choices:
          "Sélectionnez une bonne réponse.",
      });

      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // Création
  // ---------------------------------------------------------

const handleSubmit = () => {
  if (!validateChoices()) {
    return;
  }

  if (
    !formData.category ||
    !formData.type ||
    !formData.difficulty
  ) {
    return;
  }

  const payload: CreateQuestionPayload = {
    statement: formData.statement,
    category: formData.category,
    type: formData.type,
    difficulty: formData.difficulty,
    duration: formData.duration,
    points: formData.points,
    explanation: formData.explanation,
    choices,
  };
  console.log("payloea ", payload)
  submitQuestion(payload, {
    onSuccess: () => {
      toast.success("Question créée avec succès !");

      onClose();
    },

    onError: () => {
      toast.error(
        "Une erreur est survenue lors de la création de la question."
      );
    },
  });
};

  return (
    <Portal>
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ajouter une question
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {step === 1
                  ? "Informations générales de la question"
                  : "Ajoutez les choix de réponse"}
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

          {/* =================================================
              INDICATEUR DES ÉTAPES
          ================================================= */}

          <div className="flex items-center border-b border-gray-100 px-6 py-4">

            {/* Étape 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step === 1
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                1
              </div>

              <span
                className={`text-sm ${
                  step === 1
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }`}
              >
                Question
              </span>
            </div>

            <div className="mx-4 h-px flex-1 bg-gray-200" />

            {/* Étape 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step === 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                2
              </div>

              <span
                className={`text-sm ${
                  step === 2
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }`}
              >
                Choix
              </span>
            </div>
          </div>

          {/* =================================================
              CONTENU
          ================================================= */}

          <div className="flex-1 overflow-y-auto">

            {/* =================================================
                ÉTAPE 1 : QUESTION
            ================================================= */}

            {step === 1 && (
              <div className="flex flex-col gap-5 p-6">

                {/* Énoncé */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Énoncé
                  </label>

                  <textarea
                    value={formData.statement}
                    onChange={(e) =>
                      handleChange(
                        "statement",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Ex : Qui est le créateur original du noyau Linux ?"
                    className="w-full text-black rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.statement && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.statement}
                    </p>
                  )}
                </div>

                {/* Catégorie + Type */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Catégorie */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Catégorie
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleChange(
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Sélectionner
                      </option>

                      <option value="culture_generale">
                        Culture générale
                      </option>

                      <option value="linux">
                        Commandes Linux
                      </option>

                      <option value="shell">
                        Programmation Shell
                      </option>
                    </select>

                    {errors.category && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Type
                    </label>

                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleChange(
                          "type",
                          e.target.value
                        )
                      }
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Sélectionner
                      </option>

                     <option value="multiple_choice">
                      Choix multiple
                    </option>

                    <option value="command">
                      Saisie de commande
                    </option>

                    <option value="fill_blank">
                      Compléter une commande
                    </option>

                    <option value="combination">
                      Combinaison de commandes
                    </option>

                    <option value="shell_code">
                      Programmation Shell
                    </option>
                    </select>

                    {errors.type && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.type}
                      </p>
                    )}
                  </div>
                </div>

                {/* Difficulté / Durée / Points */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  {/* Difficulté */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Difficulté
                    </label>

                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        handleChange(
                          "difficulty",
                          e.target.value
                        )
                      }
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Sélectionner
                      </option>

                      <option value="easy">
                        Facile
                      </option>

                      <option value="medium">
                        Moyenne
                      </option>

                      <option value="hard">
                        Difficile
                      </option>
                    </select>

                    {errors.difficulty && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.difficulty}
                      </p>
                    )}
                  </div>

                  {/* Durée */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Durée (secondes)
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={formData.duration}
                      onChange={(e) =>
                        handleChange(
                          "duration",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.duration && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Points */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Points
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={formData.points}
                      onChange={(e) =>
                        handleChange(
                          "points",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {errors.points && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.points}
                      </p>
                    )}
                  </div>
                </div>

                {/* Explication */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Explication
                  </label>

                  <textarea
                    value={formData.explanation}
                    onChange={(e) =>
                      handleChange(
                        "explanation",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Expliquez la réponse correcte..."
                    className="w-full text-black rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {errors.explanation && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.explanation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                ÉTAPE 2 : CHOIX
            ================================================= */}

            {step === 2 && (
              <div className="flex flex-col gap-6 p-6">

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Choix de réponse
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Ajoutez autant de choix que nécessaire
                    et sélectionnez la bonne réponse.
                  </p>
                </div>

                {/* Liste des choix */}
                <div className="flex flex-col gap-3">

                  {choices.map((choice, index) => (
                    <div
                      key={choice.label}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-start gap-3">

                        {/* Label */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">
                          {choice.label}
                        </div>

                        <div className="flex-1">

                          {/* Contenu */}
                          <input
                            type="text"
                            value={choice.content}
                            onChange={(e) =>
                              handleChoiceChange(
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Contenu du choix ${choice.label}`}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          {/* Bonne réponse */}
                          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input
                              type="radio"
                              name="correctChoice"
                              checked={
                                choice.isCorrect
                              }
                              onChange={() =>
                                handleCorrectChange(
                                  index
                                )
                              }
                              className="h-4 w-4"
                            />

                            <span>
                              Bonne réponse
                            </span>
                          </label>
                        </div>

                        {/* Supprimer */}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveChoice(index)
                          }
                          disabled={
                            choices.length <= 2
                          }
                          title="Supprimer le choix"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Erreur choix */}
                {errors.choices && (
                  <p className="text-sm text-red-500">
                    {errors.choices}
                  </p>
                )}

                {/* Ajouter */}
                <button
                  type="button"
                  onClick={handleAddChoice}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-600 transition hover:border-blue-500 hover:bg-blue-50"
                >
                  <Plus size={18} />
                  Ajouter un choix
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">

            {/* Gauche */}
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Retour
              </button>
            )}

            {/* Droite */}
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Créer la question
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}