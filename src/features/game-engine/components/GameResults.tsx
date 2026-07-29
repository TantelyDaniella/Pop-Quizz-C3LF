import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, XCircle, Zap, Clock, List } from "lucide-react";
import { motion } from "framer-motion";
import { ContestService } from "../services/contest.service";
import type { LeaderboardEntry } from "../types/game.types";

type Props = { gameId: number; showLeaderboard?: boolean };

type StatItemProps = {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
    color: string;
};

function StatItem({ icon: Icon, value, label, color }: StatItemProps) {
    return (
        <div className="flex items-center justify-between py-3 sm:py-4 border-b border-(--border-color) last:border-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                <span className="text-sm sm:text-base text-(--secondary-text)">{label}</span>
            </div>
            <span className={`text-sm sm:text-base font-bold ${color}`}>{value}</span>
        </div>
    );
}

export default function GameResults({ gameId, showLeaderboard }: Props) {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry | null>(null);

    useEffect(() => {
        ContestService.getMyLeaderboard(gameId).then(setLeaderboard).catch(console.error);
    }, [gameId]);

    return (
        <div className="relative w-full md:min-h-full flex justify-around p-4 sm:p-8 overflow-x-hidden overflow-y-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-(--primary)/8 blur-[80px] sm:blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl flex flex-col gap-4 sm:gap-5">

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="flex-1 h-px bg-(--border-color)" />
                    <div className="flex items-center gap-2 text-center">
                        <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="text-xs sm:text-md uppercase tracking-widest text-(--secondary-text)">Partie terminée</span>
                    </div>
                    <div className="flex-1 h-px bg-(--border-color)" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="surface-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-5 text-center sm:text-left"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
                        <div className="relative shrink-0">
                            <img
                                src={leaderboard?.avatarUrl ?? "https://api.dicebear.com/10.x/bottts/svg?seed=default"}
                                alt="avatar"
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-yellow-400 object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg sm:text-xl truncate">{leaderboard?.username ?? "..."}</p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right shrink-0">
                        <p className="text-4xl sm:text-5xl font-black text-(--primary)">{leaderboard?.score ?? 0}</p>
                        <p className="text-xs text-(--secondary-text) uppercase tracking-wider mt-0.5 sm:mt-1">points</p>
                    </div>
                </motion.div>

                {leaderboard && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="surface-card rounded-2xl px-4 sm:px-6 py-2 h-fit"
                    >
                        <StatItem icon={Target}  value={leaderboard.correctAnswers ?? 0}                     label="Bonnes réponses"        color="text-green-400"  />
                        <StatItem icon={XCircle} value={leaderboard.wrongAnswers ?? 0}                       label="Mauvaises réponses"     color="text-red-400"    />
                        <StatItem icon={Zap}     value={leaderboard.firstBloodCount ?? 0}                    label="First Bloods"           color="text-purple-400" />
                        <StatItem icon={Clock}   value={`${(leaderboard.avgResponseTime ?? 0).toFixed(1)}s`} label="Temps de réponse moyen" color="text-blue-400"   />
                    </motion.div>
                )}

                {showLeaderboard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center mt-2 sm:mt-0"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/leaderboard", { state: { gameId } })}
                            className="btn-primary flex items-center justify-center gap-2 py-3 px-6 sm:px-8 w-full sm:w-auto rounded-xl cursor-pointer text-sm sm:text-base"
                        >
                            <List className="w-5 h-5" />
                            Voir le classement
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}