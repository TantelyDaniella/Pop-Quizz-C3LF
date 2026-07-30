import { Gamepad2, Clock, Play, CheckCircle, Loader2 } from "lucide-react";

type Contest = {
    gameId: number;
    title: string;
    status: "waiting" | "running" | "finished";
    totalQuestions?: number;
};

type Props = {
    contest: Contest;
    isJoined: boolean;
    hasJoinedAny: boolean;
    onJoin: () => void;
    isPending?: boolean;
};

const statusConfig = {
    waiting:  { icon: Clock,       label: "En attente", color: "text-yellow-400" },
    running:  { icon: Play,        label: "En cours",   color: "text-green-400"  },
    finished: { icon: CheckCircle, label: "Terminé",    color: "text-gray-400"   },
};

export default function ContestCard({ contest, isJoined, hasJoinedAny, onJoin, isPending }: Props) {
    const { icon: StatusIcon, label, color } = statusConfig[contest.status] ?? statusConfig.waiting;

    return (
        <div className="surface-card light:border rounded-md flex flex-col gap-2">
            <p className="text-sm font-bold flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 shrink-0" />
                <span>{contest.title}</span>
            </p>
            <div className={`flex items-center gap-1 text-xs ${color}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{label}</span>
            </div>
            {isJoined && <span className="text-xs text-primary">✓ Rejoint</span>}
            {!hasJoinedAny && contest.status === "waiting" && (
                <button className="btn-primary text-xs py-1 flex items-center justify-center gap-1.5" onClick={onJoin} disabled={isPending}>
                    {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                    Rejoindre
                </button>
            )}
        </div>
    );
}