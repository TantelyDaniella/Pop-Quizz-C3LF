// src/features/game-engine/components/AdminGameResults.tsx

import { useState } from "react";
import {
  Trophy,
  RotateCcw,
  Target,
  XCircle,
  Zap,
  Clock,
  Medal,
  Crown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameResults } from "../hooks/useQuiz";
import { useGameLeaderboard } from "../hooks/useGame";
import type { LeaderboardEntry } from "../types/quiz";

type Props = {
  gameId: number;
  onBackToLobby: () => void;
};

type StatItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  color: string;
};

function StatItem({ icon: Icon, value, label, color }: StatItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-(--border-color) py-4 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-base text-(--secondary-text)">{label}</span>
      </div>
      <span className={`text-base font-bold ${color}`}>{value}</span>
    </div>
  );
}

const RANK_BORDER: Record<number, string> = {
  1: "border-yellow-400",
  2: "border-slate-300",
  3: "border-orange-400",
};

export default function AdminGameResults({
  gameId,
  onBackToLobby,
}: Props) {
  const { leaderboard, isLoading: isLeaderboardLoading } =
    useGameLeaderboard(gameId);

  console.log("leaderboard is:", leaderboard);

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(
    null
  );

  // Réponse brute de /results : { countdownSeconds, revealSchedule, leaderboard }
  const { results, isLoading: isResultsLoading } = useGameResults(
    gameId,
    selectedPlayerId ?? 0,
    selectedPlayerId !== null
  );

  const entries: LeaderboardEntry[] = leaderboard ?? [];

  // NOUVEAU : on extrait l'entrée du joueur sélectionné depuis
  // results.leaderboard, puisque /results ne renvoie pas directement
  // les stats à plat mais un sous-tableau leaderboard.
  const selectedPlayerResult = results?.leaderboard?.find(
    (entry: LeaderboardEntry) => entry.playerId === selectedPlayerId
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden p-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary)/8 blur-[120px]" />

      <div className="relative z-10 flex w-full flex-col gap-5">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-(--border-color)" />
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-md uppercase tracking-widest text-(--secondary-text)">
              Partie terminée — Classement final
            </span>
          </div>
          <div className="h-px flex-1 bg-(--border-color)" />
        </motion.div>

        {isLeaderboardLoading && (
          <div className="surface-card rounded-2xl p-10 text-center text-(--secondary-text)">
            Chargement du classement...
          </div>
        )}

        {!isLeaderboardLoading && entries.length === 0 && (
          <div className="surface-card rounded-2xl p-10 text-center text-(--secondary-text)">
            Aucun résultat disponible pour cette partie.
          </div>
        )}

        {!isLeaderboardLoading && entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-3 overflow-y-auto"
          >
            {entries.map((entry, index) => {
              const rank = entry.rank ?? index + 1;
              const playerId = entry.playerId;

              return (
                <motion.button
                  key={playerId ?? entry.username ?? index}
                  type="button"
                  onClick={() =>
                    playerId && setSelectedPlayerId(playerId)
                  }
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.01 }}
                  className={`surface-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    RANK_BORDER[rank] ?? "border-(--border-color)"
                  } hover:border-(--primary)/50`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        entry.avatarUrl ??
                        "https://api.dicebear.com/10.x/bottts/svg?seed=default"
                      }
                      alt="avatar"
                      className="h-12 w-12 rounded-xl"
                    />
                    {rank === 1 && (
                      <Crown
                        size={18}
                        className="absolute -right-2 -top-2 rounded-full border-2 border-yellow-400 bg-bg-main p-0.5 text-yellow-400"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-(--primary)/30 bg-(--primary)/15 px-2 py-0.5 text-xs font-black text-(--primary)">
                        #{rank}
                      </span>
                      <p className="truncate font-bold">
                        {entry.username}
                      </p>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-(--secondary-text)">
                      <Medal className="h-3 w-3" />
                      <span>
                        {entry.correctAnswers ?? 0} bonnes réponses
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-black text-(--primary)">
                      {entry.score ?? 0}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-(--secondary-text)">
                      points
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBackToLobby}
          className="btn-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-base"
        >
          <RotateCcw className="h-5 w-5" />
          Retour au lobby
        </motion.button>
      </div>

      {/* Panneau latéral : résultats détaillés d'un joueur */}
      <AnimatePresence>
        {selectedPlayerId !== null && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="surface-card absolute right-0 top-0 z-20 h-full w-full max-w-md overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Détails du joueur
              </h3>

              <button
                type="button"
                onClick={() => setSelectedPlayerId(null)}
                className="rounded-lg p-1 text-(--secondary-text) hover:bg-(--border-color)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isResultsLoading && (
              <div className="mt-8 text-center text-(--secondary-text)">
                Chargement des résultats...
              </div>
            )}

            {!isResultsLoading && selectedPlayerResult && (
              <div className="mt-6">
                <StatItem
                  icon={Target}
                  value={selectedPlayerResult.correctAnswers ?? 0}
                  label="Bonnes réponses"
                  color="text-green-400"
                />
                <StatItem
                  icon={XCircle}
                  value={selectedPlayerResult.wrongAnswers ?? 0}
                  label="Mauvaises réponses"
                  color="text-red-400"
                />
                <StatItem
                  icon={Zap}
                  value={selectedPlayerResult.firstBloodCount ?? 0}
                  label="First Bloods"
                  color="text-purple-400"
                />
                <StatItem
                  icon={Clock}
                  value={`${(selectedPlayerResult.avgResponseTime ?? 0).toFixed(1)}s`}
                  label="Temps de réponse moyen"
                  color="text-blue-400"
                />
              </div>
            )}

            {!isResultsLoading && !selectedPlayerResult && (
              <div className="mt-8 text-center text-(--secondary-text)">
                Aucune donnée disponible pour ce joueur.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}