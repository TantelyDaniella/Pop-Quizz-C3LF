import { useEffect, useState } from "react";
import { Trophy, RotateCcw, Target, XCircle, Zap, Clock, Crown, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { AdminGameService } from "../services/admin.game.service";
import type { LeaderboardEntry } from "../types/quiz";
import LeaderboardEntryRow from "@/features/game-engine/components/LeaderboardEntryRow";

type Props = { gameId: number; onBackToLobby: () => void };

const rankStyle: Record<number, { text: string }> = {
  1: { text: "text-yellow-400" },
  2: { text: "dark:text-slate-300 text-slate-500" },
  3: { text: "text-orange-500" },
};

const podiumOrder = [1, 0, 2];
const podiumHeight: Record<number, string> = { 0: "h-16", 1: "h-24", 2: "h-12" };

export default function AdminGameResults({ gameId, onBackToLobby }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminGameService.getLeaderboard(gameId)
      .then((res) => setEntries((res as { data?: LeaderboardEntry[] })?.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) {
    return (
      <div className="surface-card rounded-2xl p-10 text-center text-(--secondary-text)">
        Chargement du classement...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="surface-card rounded-2xl p-10 text-center text-(--secondary-text)">
        Aucun résultat disponible pour cette partie.
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex-1 h-px bg-(--border-color)" />
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs uppercase tracking-widest text-(--secondary-text)">Classement final</span>
        </div>
        <div className="flex-1 h-px bg-(--border-color)" />
      </motion.div>

      {/* Podium */}
      {entries.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full flex items-end justify-center gap-4 md:gap-12"
        >
          {podiumOrder.map((idx, pos) => {
            const entry = entries[idx];
            const isFirst = entry.rank === 1;
            return (
              <div key={entry.playerId} className="flex flex-col items-center gap-2">
                {isFirst && <Crown className="w-6 h-6 text-yellow-400" />}
                <img
                  src={entry.avatarUrl}
                  alt={entry.username}
                  className={`rounded-full object-cover ${isFirst ? "w-20 h-20 border-yellow-400" : "w-14 h-14 border-(--border-color)"}`}
                />
                <p className="text-sm font-semibold truncate max-w-22.5 text-center">{entry.username}</p>
                <span className={`text-sm font-black ${rankStyle[entry.rank]?.text ?? "text-primary"}`}>
                  {entry.score} pts
                </span>
                <div className={`w-24 rounded-t-lg border ${podiumHeight[pos]} bg-primary`} />
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Liste */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl overflow-hidden border border-(--border-color) bg-bg-main"
      >
        <div className="hidden md:grid grid-cols-[2rem_2.5rem_1fr_repeat(4,5rem)_4rem] gap-4 px-4 py-2 bg-(--surface)/80 border-b border-(--border-color)">
          <span className="text-xs uppercase tracking-widest text-(--secondary-text)">#RANK</span>
          <span />
          <span className="text-xs uppercase tracking-widest text-(--secondary-text)">Joueur</span>
          <span className="text-xs uppercase tracking-widest text-center text-green-400"><Target className="w-4 h-4 mx-auto" /></span>
          <span className="text-xs uppercase tracking-widest text-center text-red-400"><Ban className="w-4 h-4 mx-auto" /></span>
          <span className="text-xs uppercase tracking-widest text-center text-purple-400"><Zap className="w-4 h-4 mx-auto" /></span>
          <span className="text-xs uppercase tracking-widest text-center text-blue-400"><Clock className="w-4 h-4 mx-auto" /></span>
          <span className="text-xs uppercase tracking-widest text-(--secondary-text) text-right">Pts</span>
        </div>

        {entries.map((entry, i) => (
          <LeaderboardEntryRow key={entry.playerId} entry={entry} index={i} />
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBackToLobby}
        className="self-center flex items-center justify-center gap-2 py-3 px-8 rounded-xl cursor-pointer text-base border border-(--border-color) text-(--secondary-text) hover:bg-(--input-bg) transition-colors"
      >
        <RotateCcw className="w-5 h-5" />
        Retour au lobby
      </motion.button>
    </div>
  );
}