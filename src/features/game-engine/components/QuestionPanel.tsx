import { useEffect, useRef, useState } from "react";
import { Loader2, Hourglass } from "lucide-react";
import type { Question } from "../types/game.types";

type Props = {
  question: Question;
  onAnswer: (choiceId: number) => void;
  onSubmit: (choiceId: number | null) => void;
  questionIndex: number;
  totalQuestions: number;
  submitting: boolean;
  submitted: boolean;
};

export default function QuestionPanel({ question, onAnswer, onSubmit, questionIndex, totalQuestions, submitting, submitted }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.duration);
  const submittedRef = useRef(false);

  useEffect(() => {
    setSelected(null);
    setTimeLeft(question.duration);
    submittedRef.current = false;
  }, [question.questionId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submittedRef.current && !submitted) {
        submittedRef.current = true;
        onSubmit(selected);
      }
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleSelect = (choiceId: number) => {
    if (timeLeft <= 0 || submitted) return;
    setSelected(choiceId);
    onAnswer(choiceId);
  };

  const handleSubmit = () => {
    submittedRef.current = true;
    onSubmit(selected);
  };

  const timedOut = timeLeft <= 0;
  const pct = (timeLeft / question.duration) * 100;
  const barColor = timeLeft > 10 ? "bg-(--primary)" : timeLeft > 5 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-(--secondary-text)">
        <span>Question {questionIndex + 1} / {totalQuestions}</span>
        <span className="font-mono">{timeLeft}s</span>
      </div>
      <div className="w-full h-2 rounded-full bg-(--border-color) overflow-hidden">
        <div className={`h-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs uppercase tracking-wider text-(--secondary-text)">{question.category}</p>
      <h2 className="text-2xl font-semibold leading-snug">{question.statement}</h2>
      <p className="text-sm text-(--secondary-text)">{question.points} pts</p>
      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((c) => {
          const picked = selected === c.choiceId;
          return (
            <button
              key={c.choiceId}
              onClick={() => handleSelect(c.choiceId)}
              disabled={submitted}
              className={`surface-card text-left py-4 px-5 rounded-xl text-base font-medium transition-all cursor-pointer
                ${picked ? "ring-2 ring-(--primary) bg-(--primary)/10" : "hover:ring-2 hover:ring-(--primary)/40"}
                ${submitted ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="font-bold mr-2">{c.label}.</span> {c.content}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-3">
        {selected !== null && !timedOut && !submitted && (
          <p className="text-xs text-(--secondary-text) mr-auto">Vous pouvez changer votre réponse avant de valider.</p>
        )}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={timedOut || selected === null || submitting}
            className="btn-primary px-6 py-2 rounded-xl font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> chargement...</> : "Valider"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-(--secondary-text) animate-pulse">
            <Hourglass className="w-4 h-4" />
            En attente de la fin du quizz...
          </div>
        )}
      </div>
    </div>
  );
}
