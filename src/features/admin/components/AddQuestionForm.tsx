import { useState } from "react";
import { ArrowLeft, Plus, Trash2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Portal } from "./Portal";
import type { QuestionChoice, QuestionCategory, QuestionType, QuestionDifficulty, CreateQuestionPayload } from "../types/question";
import { useCreateQuestion } from "../hooks/useQuestion";

type Props = { onClose: () => void };
type FormData = {
  statement: string; category: QuestionCategory | ""; type: QuestionType | "";
  difficulty: QuestionDifficulty | ""; duration: number; points: number; explanation: string;
};
type FormErrors = { statement?: string; category?: string; type?: string; difficulty?: string; duration?: string; points?: string; explanation?: string; choices?: string };

export default function AddQuestionForm({ onClose }: Props) {
  const { submitQuestion, isPending } = useCreateQuestion();
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<FormData>({
    statement: "", category: "", type: "", difficulty: "", duration: 15, points: 10, explanation: "",
  });

  const [choices, setChoices] = useState<QuestionChoice[]>([
    { label: "A", content: "", isCorrect: false },
    { label: "B", content: "", isCorrect: false },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStepOne = () => {
    const newErrors: FormErrors = {};
    if (!formData.statement.trim()) newErrors.statement = "L'énoncé est obligatoire.";
    if (!formData.category) newErrors.category = "La catégorie est obligatoire.";
    if (!formData.type) newErrors.type = "Le type est obligatoire.";
    if (!formData.difficulty) newErrors.difficulty = "La difficulté est obligatoire.";
    if (formData.duration <= 0) newErrors.duration = "La durée doit être supérieure à 0.";
    if (formData.points <= 0) newErrors.points = "Les points doivent être supérieurs à 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStepOne()) setStep(2); };

  const getChoiceLabel = (index: number): string => {
    let label = ""; let number = index + 1;
    while (number > 0) {
      const remainder = (number - 1) % 26;
      label = String.fromCharCode(65 + remainder) + label;
      number = Math.floor((number - 1) / 26);
    }
    return label;
  };

  const handleAddChoice = () => {
    setChoices((prev) => [...prev, { label: getChoiceLabel(prev.length), content: "", isCorrect: false }]);
    setErrors((prev) => ({ ...prev, choices: undefined }));
  };

  const handleChoiceChange = (index: number, content: string) => {
    setChoices((prev) => prev.map((c, i) => (i === index ? { ...c, content } : c)));
  };

  const handleCorrectChange = (index: number) => {
    setChoices((prev) => prev.map((c, i) => ({ ...c, isCorrect: i === index })));
    setErrors((prev) => ({ ...prev, choices: undefined }));
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length <= 2) return;
    setChoices((prev) => prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, label: getChoiceLabel(i) })));
  };

  const validateChoices = () => {
    if (choices.length < 2) { setErrors({ choices: "Ajoutez au moins deux choix." }); return false; }
    const emptyChoice = choices.some((c) => !c.content.trim());
    if (emptyChoice) { setErrors({ choices: "Tous les choix doivent avoir un contenu." }); return false; }
    const correctChoice = choices.some((c) => c.isCorrect);
    if (!correctChoice) { setErrors({ choices: "Sélectionnez une bonne réponse." }); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validateChoices()) return;
    if (!formData.category || !formData.type || !formData.difficulty) return;

    const payload: CreateQuestionPayload = {
      statement: formData.statement, category: formData.category, type: formData.type,
      difficulty: formData.difficulty, duration: formData.duration, points: formData.points,
      explanation: formData.explanation, choices,
    };

    submitQuestion(payload, {
      onSuccess: () => { toast.success("Question créée avec succès !"); onClose(); },
      onError: () => { toast.error("Une erreur est survenue lors de la création de la question."); },
    });
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ajouter une question</h2>
              <p className="mt-1 text-xs text-gray-500">{step === 1 ? "Informations générales de la question" : "Ajoutez les choix de réponse"}</p>
            </div>
            <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"><X size={20} /></button>
          </div>

          <div className="flex items-center border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}>1</div>
              <span className={`text-sm ${step === 1 ? "font-medium text-gray-900" : "text-gray-500"}`}>Question</span>
            </div>
            <div className="mx-4 h-px flex-1 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>2</div>
              <span className={`text-sm ${step === 2 ? "font-medium text-gray-900" : "text-gray-500"}`}>Choix</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {step === 1 && (
              <div className="flex flex-col gap-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Énoncé</label>
                  <textarea value={formData.statement} onChange={(e) => handleChange("statement", e.target.value)} rows={3} placeholder="Ex : Qui est le créateur original du noyau Linux ?"
                    className="w-full text-black rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  {errors.statement && <p className="mt-1 text-xs text-red-500">{errors.statement}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Catégorie</label>
                    <select value={formData.category} onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Sélectionner</option>
                      <option value="culture_generale">Culture générale</option>
                      <option value="linux_command">Commandes Linux</option>
                      <option value="shell">Programmation Shell</option>
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Type</label>
                    <select value={formData.type} onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Sélectionner</option>
                      <option value="multiple_choice">Choix multiple</option>
                      <option value="command">Saisie de commande</option>
                      <option value="fill_blank">Compléter une commande</option>
                      <option value="combination">Combinaison de commandes</option>
                      <option value="shell_code">Programmation Shell</option>
                    </select>
                    {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Difficulté</label>
                    <select value={formData.difficulty} onChange={(e) => handleChange("difficulty", e.target.value)}
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="">Sélectionner</option>
                      <option value="easy">Facile</option>
                      <option value="medium">Moyenne</option>
                      <option value="hard">Difficile</option>
                    </select>
                    {errors.difficulty && <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Durée (secondes)</label>
                    <input type="number" min={1} value={formData.duration} onChange={(e) => handleChange("duration", Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Points</label>
                    <input type="number" min={1} value={formData.points} onChange={(e) => handleChange("points", Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    {errors.points && <p className="mt-1 text-xs text-red-500">{errors.points}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Explication</label>
                  <textarea value={formData.explanation} onChange={(e) => handleChange("explanation", e.target.value)} rows={3} placeholder="Expliquez la réponse correcte..."
                    className="w-full text-black rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  {errors.explanation && <p className="mt-1 text-xs text-red-500">{errors.explanation}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 p-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Choix de réponse</h3>
                  <p className="mt-1 text-sm text-gray-500">Ajoutez autant de choix que nécessaire et sélectionnez la bonne réponse.</p>
                </div>

                <div className="flex flex-col gap-3">
                  {choices.map((choice, index) => (
                    <div key={choice.label} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">{choice.label}</div>
                        <div className="flex-1">
                          <input type="text" value={choice.content} onChange={(e) => handleChoiceChange(index, e.target.value)}
                            placeholder={`Contenu du choix ${choice.label}`}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input type="radio" name="correctChoice" checked={choice.isCorrect} onChange={() => handleCorrectChange(index)} className="h-4 w-4" />
                            <span>Bonne réponse</span>
                          </label>
                        </div>
                        <button type="button" onClick={() => handleRemoveChoice(index)} disabled={choices.length <= 2}
                          title="Supprimer le choix"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.choices && <p className="text-sm text-red-500">{errors.choices}</p>}

                <button type="button" onClick={handleAddChoice}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-600 transition hover:border-blue-500 hover:bg-blue-50">
                  <Plus size={18} /> Ajouter un choix
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            {step === 1 ? (
              <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Annuler</button>
            ) : (
              <button type="button" onClick={() => setStep(1)} disabled={isPending} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                <ArrowLeft size={16} /> Retour
              </button>
            )}
            {step === 1 ? (
              <button type="button" onClick={handleNext} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">Suivant</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isPending} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPending ? "Création..." : "Créer la question"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
