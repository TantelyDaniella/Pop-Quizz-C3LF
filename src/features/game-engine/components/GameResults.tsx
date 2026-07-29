import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, RotateCcw, Target, XCircle, Zap, Clock, Medal, Crown, List } from "lucide-react";
import { motion } from "framer-motion";
import { ContestService } from "../services/contest.service";
import type { LeaderboardEntry } from "../types/game.types";

type Props = { score: number; gameId: number; onBackToLobby: () => void };

type StatItemProps = {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
    color: string;
};

function StatItem({ icon: Icon, value, label, color }: StatItemProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-(--border-color) last:border-0">
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-base text-(--secondary-text)">{label}</span>
            </div>
            <span className={`text-base font-bold ${color}`}>{value}</span>
        </div>
    );
}

export default function GameResults({ score, gameId, onBackToLobby }: Props) {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry | null>(null);

    useEffect(() => {
        ContestService.getMyLeaderboard(gameId).then(setLeaderboard).catch(console.error);
    }, [gameId]);

    const rank = leaderboard?.rank ?? null;

    return (
        <div className="relative w-full h-full flex p-8 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-(--primary)/8 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col gap-5">

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="flex-1 h-px bg-(--border-color)" />
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-md uppercase tracking-widest text-(--secondary-text)">Partie terminée</span>
                    </div>
                    <div className="flex-1 h-px bg-(--border-color)" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="surface-card rounded-2xl p-6 flex items-center gap-5"
                >
                    <div className="relative shrink-0">
                        <img
                            src={leaderboard?.avatarUrl ?? "https://api.dicebear.com/10.x/bottts/svg?seed=default"}
                            alt="avatar"
                            className="w-20 h-20 rounded-xl border-2 border-yellow-400"
                        />
                        {rank === 1 && <Crown size={30} className="absolute -top-3 -right-2 text-yellow-400 bg-bg-main border border-yellow-400 border-2 p-1 rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-xl truncate">{leaderboard?.username ?? "..."}</p><div className="flex items-center gap-2 mt-1">
                        <Medal className="w-4 h-4 text-(--secondary-text)" />
                        <span className="text-sm text-(--secondary-text)">Classement</span>
                        <span className="px-2 py-0.5 rounded-full bg-(--primary)/15 text-(--primary) text-sm font-black border border-(--primary)/30">
                                {rank ? `#${rank}` : "—"}
                        </span>
                    </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-5xl font-black text-(--primary)">{score ?? 0}</p>
                        <p className="text-xs text-(--secondary-text) uppercase tracking-wider mt-1">points</p>
                    </div>
                </motion.div>

                {leaderboard && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="surface-card rounded-2xl px-6 py-2 flex-1"
                    >
                        <StatItem icon={Target}  value={leaderboard.correctAnswers ?? 0}                     label="Bonnes réponses"        color="text-green-400"  />
                        <StatItem icon={XCircle} value={leaderboard.wrongAnswers ?? 0}                       label="Mauvaises réponses"     color="text-red-400"    />
                        <StatItem icon={Zap}     value={leaderboard.firstBloodCount ?? 0}                    label="First Bloods"           color="text-purple-400" />
                        <StatItem icon={Clock}   value={`${(leaderboard.avgResponseTime ?? 0).toFixed(1)}s`} label="Temps de réponse moyen" color="text-blue-400"   />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onBackToLobby}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer text-base border border-(--border-color) text-(--secondary-text) hover:bg-(--input-bg) transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Retour au lobby
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/leaderboard", { state: { gameId } })}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer text-base"
                    >
                        <List className="w-5 h-5" />
                        Voir le classement
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}