import { useLocation } from "react-router-dom";
import { Trophy, Medal, Target, XCircle, Zap, Clock, Crown } from "lucide-react";
import { motion } from "framer-motion";
import type { LeaderboardEntry } from "../types/game.types";
import {useEffect, useState} from "react";
import {ContestService} from "@/features/game-engine/services/contest.service.ts";

const rankStyle: Record<number, { border: string; bg: string; badge: string; text: string }> = {
    1: { border: "border border-yellow-400/60", bg: "", badge: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30", text: "text-yellow-400" },
    2: { border: "border border-slate-400/60", bg: "", badge: "bg-slate-400/15 text-slate-300 border-slate-400/30", text: "dark:text-slate-300 text-slate-500 " },
    3: { border: "border border-orange-600/60", bg: "", badge: "bg-orange-700/15 text-orange-500 border-orange-600/30", text: "text-orange-500" },
};

const podiumOrder = [1, 0, 2]; // 2e, 1er, 3e
const podiumHeight: Record<number, string> = { 0: "h-16", 1: "h-24", 2: "h-12" };
const podiumBg: Record<number, string> = {
    0: "bg-primary ",
    1: "bg-primary ",
    2: "bg-primary ",
};

export default function LeaderboardPage() {
    const location = useLocation();
    const gameId = (location.state as { gameId?: number } | null)?.gameId;
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        if (!gameId) { setLoading(false); return; }
        ContestService.getLeaderboard(gameId)
            .then(setEntries)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [gameId]);

    if (!gameId) return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <Trophy className="w-12 h-12 text-(--secondary-text)" />
            <p className="text-(--secondary-text)">Aucune partie sélectionnée.</p>
        </div>
    );

    return (
        <div className="relative w-full h-full flex flex-col p-8 overflow-y-auto">

            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 rounded-full bg-yellow-500/5 blur-[100px] pointer-events-none z-0" />
            <div className="absolute -bottom-25 -left-25 w-100 h-100 rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0" />
            <div className="absolute top-50 -right-37.5 w-87.5 h-87.5 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 w-full flex flex-col gap-6">

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
                        className="flex items-end justify-center gap-20"
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
                                        className={`rounded-full object-cover ${isFirst ? "w-20 h-20 border-yellow-400" : "w-14 h-14 border-(--border-color)"
                                        }`}
                                    />
                                    <p className="text-sm font-semibold truncate max-w-22.5 text-center">{entry.username}</p>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${rankStyle[entry.rank]?.badge}`}>
                                        #{entry.rank}
                                    </span>
                                    <span className={`text-sm font-black ${rankStyle[entry.rank]?.text ?? "text-primary"}`}>
                                        {entry.score} pts
                                    </span>
                                    {/* Podium block */}
                                    <div className={`w-24 rounded-t-lg border ${podiumHeight[pos]} ${podiumBg[pos]}`} />
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
                    {/* Thead */}
                    <div className="grid grid-cols-[2rem_2.5rem_1fr_repeat(4,5rem)_4rem] gap-4 px-4 py-2 bg-(--surface)/80 border-b border-(--border-color)">
                        <span className="text-xs uppercase tracking-widest text-(--secondary-text)">#RANK</span>
                        <span />
                        <span className="text-xs uppercase tracking-widest text-(--secondary-text)">Joueur</span>
                        <span className="text-xs uppercase tracking-widest text-center text-green-400"><Target className="w-4 h-4 text-green-400 mx-auto" /></span>
                        <span className="text-xs uppercase tracking-widest text-secondary-text text-center"><XCircle className="w-4 h-4 text-red-400 mx-auto" /></span>
                        <span className="text-xs uppercase tracking-widest text-center text-purple-400"><Zap className="w-4 h-4 text-purple-400 mx-auto" /></span>
                        <span className="text-xs uppercase tracking-widest text-center text-blue-400"><Clock className="w-4 h-4 text-blue-400 mx-auto" /></span>
                        <span className="text-xs uppercase tracking-widest text-(--secondary-text) text-right">Pts</span>
                    </div>

                    {/* Rows */}
                    {entries.map((entry, i) => (
                        <motion.div
                            key={entry.playerId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.04 }}
                            className={`grid grid-cols-[2rem_2.5rem_1fr_repeat(4,5rem)_4rem] gap-4 px-4 py-3 items-center
                            border-b border-(--border-color) last:border-0 transition-colors hover:bg-(--surface)/60
                                ${rankStyle[entry.rank]?.bg ?? ""}`}
                        >
                            <span className={`font-black text-sm ${rankStyle[entry.rank]?.text ?? "text-(--secondary-text)"}`}>
                                {entry.rank <= 3 ? <Medal className="w-4 h-4 inline" /> : `#${entry.rank}`}
                            </span>
                            <img src={entry.avatarUrl} alt={entry.username}
                                 className="w-8 h-8 rounded-full border border-(--border-color) object-cover" />
                            <span className="font-semibold text-sm truncate">{entry.username}</span>
                            <span className="text-sm text-center  font-medium">{entry.correctAnswers}</span>
                            <span className="text-sm text-center  font-medium">{entry.wrongAnswers}</span>
                            <span className="text-sm text-center  font-medium">{entry.firstBloodCount}</span>
                            <span className="text-sm text-center  font-medium">{entry.avgResponseTime.toFixed(1)}s</span>
                            <span className="text-sm text-right font-bold text-primary">{entry.score}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}