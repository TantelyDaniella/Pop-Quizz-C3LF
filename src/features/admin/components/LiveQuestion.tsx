import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Trophy,
  Users,
  XCircle,
  Loader2,
} from "lucide-react";

export interface Answer {
  choiceId: number;
  label: string;
  content: string;
  orderIndex: number;
}

interface LiveQuestionProps {
  questionNumber: number;
  totalQuestions: number;

  // Total de questions toutes catégories confondues
  totalQuestionsGlobal: number;

  question: string;
  answers: Answer[];

  // Réponse correcte (correspond au champ `content` d'une réponse),
  // utilisée pour colorer la bonne réponse en vert quand le temps est écoulé
  correctAnswer: string;

  duration: number;
  startedAt: number;

  answeredPlayers: number;
  totalPlayers: number;

  correctPercentage: number;
  incorrectPercentage: number;

  isOpeningNext?: boolean;
  isEndingQuiz?: boolean;
  onNext: () => void;
  onEndQuiz: () => void;
}

export default function LiveQuestion({
  questionNumber,
  totalQuestions,
  totalQuestionsGlobal,
  question,
  answers,
  correctAnswer,
  duration,
  startedAt,
  answeredPlayers,
  totalPlayers,
  correctPercentage,
  incorrectPercentage,
  isOpeningNext,
  isEndingQuiz,
  onNext,
  onEndQuiz,
}: LiveQuestionProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // --- Compteur global continu (ne dépend pas du reset par catégorie) ---
  const globalIndexRef = useRef(0);
  const lastQuestionRef = useRef<string | null>(null);

  if (lastQuestionRef.current !== question) {
    globalIndexRef.current += 1;
    lastQuestionRef.current = question;
  }

  const globalQuestionNumber = globalIndexRef.current;

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = Date.now() - startedAt;

      const remaining = Math.max(
        0,
        duration - Math.floor(elapsed / 1000)
      );

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [duration, startedAt]);

  const answeredPercentage =
    totalPlayers > 0
      ? Math.round(
          (answeredPlayers / totalPlayers) * 100
        )
      : 0;

  // Progression basée sur le compteur GLOBAL, plus sur questionNumber/totalQuestions
  const questionProgress =
    totalQuestionsGlobal > 0
      ? Math.round(
          (globalQuestionNumber / totalQuestionsGlobal) * 100
        )
      : 0;

  const isTimeRunningOut = timeLeft <= 5;

  // Temps écoulé -> on révèle la bonne réponse
  const isTimeUp = timeLeft <= 0;

  const isCorrectAnswer = (answer: Answer) =>
    answer.content === correctAnswer;

  // NOUVEAU : dernière question atteinte -> le bouton devient "Voir le résultat"
  const isLastQuestion =
    totalQuestionsGlobal > 0 &&
    globalQuestionNumber >= totalQuestionsGlobal;

  return (
    <div className="space-y-6">

      {/* Progression de la question */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Question {globalQuestionNumber} / {totalQuestionsGlobal}
          </span>

          <span className="text-sm text-slate-500">
            {questionProgress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${questionProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Joueurs ayant répondu */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Users
                size={20}
                className="text-blue-600"
              />
            </div>

            <span className="text-sm text-slate-500">
              Joueurs ayant répondu
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {answeredPercentage}%
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {answeredPlayers} / {totalPlayers} joueurs
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${answeredPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Réponses correctes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <CheckCircle2
                size={20}
                className="text-green-600"
              />
            </div>

            <span className="text-sm text-slate-500">
              Réponses correctes
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-green-600">
            {correctPercentage}%
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{
                width: `${correctPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Réponses incorrectes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2">
              <XCircle
                size={20}
                className="text-red-600"
              />
            </div>

            <span className="text-sm text-slate-500">
              Réponses incorrectes
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-red-600">
            {incorrectPercentage}%
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{
                width: `${incorrectPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Header question */}
        <div className="mb-6 flex items-center justify-between">

          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            Question {globalQuestionNumber}
          </span>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${
              isTimeRunningOut
                ? "bg-red-50 text-red-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <Clock3 size={18} />

            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Texte question */}
        <h2 className="text-2xl font-bold leading-relaxed text-slate-900">
          {question}
        </h2>

        {/* Réponses */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">

          {answers.map((answer) => {
            const isCorrect = isTimeUp && isCorrectAnswer(answer);

            return (
              <div
                key={answer.choiceId}
                className={`rounded-xl border p-5 transition ${
                  isCorrect
                    ? "border-green-400 bg-green-100"
                    : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-4">

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold shadow-sm ${
                      isCorrect
                        ? "bg-green-500 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {answer.label}
                  </span>

                  <span
                    className={`text-lg font-medium ${
                      isCorrect ? "text-green-800" : "text-slate-800"
                    }`}
                  >
                    {answer.content}
                  </span>

                  {isCorrect && (
                    <CheckCircle2
                      size={22}
                      className="ml-auto shrink-0 text-green-600"
                    />
                  )}

                </div>
              </div>
            );
          })}

        </div>

        {/* Progression des réponses */}
        <div className="mt-8">

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-slate-500">
              Réponses reçues
            </span>

            <span className="font-medium text-slate-700">
              {answeredPlayers} / {totalPlayers}
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{
                width: `${answeredPercentage}%`,
              }}
            />
          </div>

        </div>

        {/* Bouton suivant / voir le résultat */}
        <div className="mt-8 flex justify-end">

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onEndQuiz}
              disabled={isEndingQuiz}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEndingQuiz ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trophy size={18} />
              )}
              {isEndingQuiz ? "Terminaison..." : "Voir le résultat"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={isOpeningNext}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOpeningNext ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight size={18} />
              )}
              {isOpeningNext ? "Ouverture..." : "Question suivante"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}