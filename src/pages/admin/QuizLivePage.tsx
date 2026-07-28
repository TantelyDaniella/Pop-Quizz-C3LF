import { useParams } from "react-router-dom";
import { Play } from "lucide-react";

export default function QuizLivePage() {
  const { gameId } = useParams();

  const handleStartRound = () => {
    console.log("Démarrer le premier round :", gameId);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Quiz en direct
          </h1>

          <p className="mt-2 text-slate-400">
            Game #{gameId}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Quiz Linux
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Prêt à commencer
              </p>
            </div>

            <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400">
              En attente
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Questions
              </p>

              <p className="mt-2 text-2xl font-bold">
                20
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Round actuel
              </p>

              <p className="mt-2 text-2xl font-bold">
                0 / 20
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Participants
              </p>

              <p className="mt-2 text-2xl font-bold">
                0
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleStartRound}
              className="flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <Play size={20} />
              Commencer le round 1
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}