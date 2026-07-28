import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Users, XCircle } from "lucide-react";

export interface Answer {
  id: number;
  label: string;
  text: string;
}

interface Props {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: Answer[];
  duration: number;
  startedAt: number;
  answeredPlayers: number;
  totalPlayers: number;
  correctPercentage: number;
  incorrectPercentage: number;
  onNext: () => void;
}

export default function LiveQuestion({
  questionNumber, totalQuestions, question, answers, duration, startedAt,
  answeredPlayers, totalPlayers, correctPercentage, incorrectPercentage, onNext,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = Date.now() - startedAt;
      setTimeLeft(Math.max(0, duration - Math.floor(elapsed / 1000)));
    };
    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, [duration, startedAt]);

  const answeredPercentage = totalPlayers > 0 ? Math.round((answeredPlayers / totalPlayers) * 100) : 0;
  const questionProgress = totalQuestions > 0 ? Math.round((questionNumber / totalQuestions) * 100) : 0;
  const isTimeRunningOut = timeLeft <= 5;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Question {questionNumber} / {totalQuestions}</span>
          <span className="text-sm text-slate-500">{questionProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${questionProgress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2"><Users size={20} className="text-blue-600" /></div>
            <span className="text-sm text-slate-500">Joueurs ayant répondu</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{answeredPercentage}%</p>
          <p className="mt-1 text-sm text-slate-500">{answeredPlayers} / {totalPlayers} joueurs</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${answeredPercentage}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2"><CheckCircle2 size={20} className="text-green-600" /></div>
            <span className="text-sm text-slate-500">Réponses correctes</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-green-600">{correctPercentage}%</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${correctPercentage}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2"><XCircle size={20} className="text-red-600" /></div>
            <span className="text-sm text-slate-500">Réponses incorrectes</span>
          </div>
          <p className="mt-3 text-3xl font-bold text-red-600">{incorrectPercentage}%</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: `${incorrectPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">Question {questionNumber}</span>
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${isTimeRunningOut ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
            <Clock3 size={18} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-relaxed text-slate-900">{question}</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {answers.map((answer) => (
            <div key={answer.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm">{answer.label}</span>
                <span className="text-lg font-medium text-slate-800">{answer.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-500">Réponses reçues</span>
            <span className="font-medium text-slate-700">{answeredPlayers} / {totalPlayers}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${answeredPercentage}%` }} />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button type="button" onClick={onNext}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            Question suivante <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
