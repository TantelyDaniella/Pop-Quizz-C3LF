import { useEffect, useState } from "react";
import { Trophy, Target, Ban, Zap, Clock, Crown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ContestService } from "@/features/game-engine/services/contest.service";
import type { LeaderboardEntry } from "../types/quiz";
import LeaderboardEntryRow from "@/features/game-engine/components/LeaderboardEntryRow";

type Props = { gameId: number };

const podiumOrder = [1, 0, 2];
const podiumHeight: Record<number, string> = { 0: "h-16", 1: "h-24", 2: "h-12" };

export default function AdminGameResults({ gameId }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContestService.getLeaderboard(gameId)
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Chargement...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        Aucun résultat disponible pour cette partie.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm [--border-color:theme(colors.slate.200)] [--surface:theme(colors.slate.50)] [--primary-text:theme(colors.slate.700)] [--input-bg:theme(colors.slate.50)]">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs uppercase tracking-widest text-slate-400">Classement final</span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </motion.div>

        {/* Podium */}
        {entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-end justify-center gap-4 md:gap-12"
          >
            {podiumOrder.map((idx, pos) => {
              const entry = entries[idx];
              const isFirst = entry.rank === 1;
              return (
                <div key={entry.playerId} className="flex flex-col items-center gap-2">
                  {isFirst && <Crown className="w-6 h-6 text-yellow-500" />}
                  <img
                    src={entry.avatarUrl}
                    alt={entry.username}
                    className={`rounded-full object-cover ${isFirst ? "w-20 h-20 ring-2 ring-yellow-400" : "w-14 h-14 ring-1 ring-slate-300"}`}
                  />
                  <p className="text-sm font-semibold truncate max-w-22.5 text-center text-slate-700">{entry.username}</p>
                  <span className={`text-sm font-black ${entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-slate-500" : entry.rank === 3 ? "text-orange-500" : "text-blue-600"}`}>
                    {entry.score} pts
                  </span>
                  <div className={`w-24 rounded-t-lg bg-blue-600 ${podiumHeight[pos]}`} />
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl overflow-hidden border border-slate-200"
        >
          <div className="hidden md:grid grid-cols-[2rem_2.5rem_1fr_repeat(4,5rem)_4rem] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-xs uppercase tracking-widest text-slate-400">#RANK</span>
            <span />
            <span className="text-xs uppercase tracking-widest text-slate-400">Joueur</span>
            <span className="text-xs uppercase tracking-widest text-center text-green-500"><Target className="w-4 h-4 mx-auto" /></span>
            <span className="text-xs uppercase tracking-widest text-center text-red-500"><Ban className="w-4 h-4 mx-auto" /></span>
            <span className="text-xs uppercase tracking-widest text-center text-purple-500"><Zap className="w-4 h-4 mx-auto" /></span>
            <span className="text-xs uppercase tracking-widest text-center text-blue-500"><Clock className="w-4 h-4 mx-auto" /></span>
            <span className="text-xs uppercase tracking-widest text-slate-400 text-right">Pts</span>
          </div>

          {entries.map((entry, i) => (
            <LeaderboardEntryRow key={entry.playerId} entry={entry} index={i} />
          ))}
        </motion.div>

      </div>
    </div>
  );
}