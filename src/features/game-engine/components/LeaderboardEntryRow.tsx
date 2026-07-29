import { Medal, Target, XCircle, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { LeaderboardEntry } from "../types/game.types";

type Props = { entry: LeaderboardEntry; index: number };

const rankText: Record<number, string> = {
    1: "text-yellow-400",
    2: "dark:text-slate-300 text-slate-500",
    3: "text-orange-500",
};

export default function LeaderboardEntryRow({ entry, index }: Props) {
    const rankClass = rankText[entry.rank] ?? "text-primary-text";

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.04 }}
            className="flex flex-col gap-3 px-4 py-3 border-b border-(--border-color) last:border-0 transition-colors hover:bg-(--surface)/60
                 md:grid md:grid-cols-[2rem_2.5rem_1fr_repeat(4,5rem)_4rem] md:items-center md:gap-4"
        >
            {/* Ligne principale : rang, avatar, pseudo, score */}
            <div className="flex items-center gap-3 md:contents">
                <span className={`flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                    entry.rank <= 3 ? rankClass : "bg-(--surface) border border-(--border-color) text-primary-text"
                }`}>
                  {entry.rank <= 3 ? <Medal className="w-4 h-4" /> : entry.rank}
                </span>
                <img
                    src={entry.avatarUrl}
                    alt={entry.username}
                    className="w-8 h-8 rounded-full border border-(--border-color) object-cover"
                />
                <span className="font-semibold text-sm truncate flex-1 md:flex-none">{entry.username}</span>
                <span className="text-sm font-bold text-primary md:text-right md:order-last">{entry.score} pts</span>
            </div>

            {/* Stats : items sur mobile, cellules de grid sur desktop */}
            <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-(--secondary-text) md:contents">
                <span className="flex items-center gap-1 md:justify-center md:text-sm">
                  <Target className="w-3.5 h-3.5 dark:text-green-400/40 text-green-400/60" /> {entry.correctAnswers}
                </span>
                        <span className="flex items-center gap-1 md:justify-center md:text-sm">
                  <XCircle className="w-3.5 h-3.5 dark:text-red-400/40 text-red-400/60" /> {entry.wrongAnswers}
                </span>
                        <span className="flex items-center gap-1 md:justify-center md:text-sm">
                  <Zap className="w-3.5 h-3.5 dark:text-purple-400/40 text-purple-400/60" /> {entry.firstBloodCount}
                </span>
                        <span className="flex items-center gap-1 md:justify-center md:text-sm">
                  <Clock className="w-3.5 h-3.5 dark:text-blue-400/40 text-blue-400/60" /> {entry.avgResponseTime.toFixed(1)}s
                </span>
            </div>
        </motion.div>
    );
}