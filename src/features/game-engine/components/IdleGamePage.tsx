import { Dices } from "lucide-react";

export default function IdleGamePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-80 h-full w-full p-8 mt-35 text-center">
            {/* Badge / Icône Centrale */}
            <div className="mb-5 p-4 rounded-2xl bg-bg-main border border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <Dices className="w-10 h-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
            </div>

            {/* Message d'attente */}
            <h3 className="text-lg font-bold tracking-wide uppercase text-slate-100 mb-1">
                Aucune session active
            </h3>
            <p className="text-sm max-w-sm text-(--secondary-text) leading-relaxed">
                Sélectionnez une partie dans la sidebar pour commencer.
            </p>
        </div>
    );
}