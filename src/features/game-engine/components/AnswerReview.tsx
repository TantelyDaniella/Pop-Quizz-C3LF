import { CheckCircle2, XCircle, Users, Hourglass } from "lucide-react";
import type { Question } from "../types/game.types";

type Props = {
  question: Question;
  correctAnswer: unknown;
  progress: { answeredCount: number; totalParticipants: number };
  selectedChoiceId: number | null;
};

export default function AnswerReview({ question, correctAnswer, progress, selectedChoiceId }: Props) {
  const correctLabel = String(correctAnswer ?? "");

  const correctChoice = question.choices.find(
    (c) => c.content.toLowerCase() === correctLabel.toLowerCase()
  );

  return (
    <div className="p-10 flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{question.statement}</h2>
      <p className="text-sm text-(--secondary-text)">{question.explanation}</p>
      <div className="flex flex-col gap-2">
        {question.choices.map((c) => {
          const isCorrect = correctChoice?.choiceId === c.choiceId;
          const wasSelected = selectedChoiceId === c.choiceId;
          let style = "border-(--border-color)";
          if (isCorrect) style = "border-green-500 bg-green-500/10";
          else if (wasSelected) style = "border-red-500 bg-red-500/10";

          return (
            <div
              key={c.choiceId}
              className={`flex items-center justify-between border-2 rounded-xl px-5 py-4 ${style}`}
            >
              <span className="font-medium">
                <span className="font-bold mr-2">{c.label}.</span> {c.content}
              </span>
              {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
              {wasSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-sm text-(--secondary-text)">
        <Users className="w-4 h-4" />
        <span>{progress.answeredCount} / {progress.totalParticipants} ont répondu</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-(--secondary-text) animate-pulse justify-end">
        <Hourglass className="w-4 h-4" />
        En attente de la fin du quizz...
      </div>
    </div>
  );
}
