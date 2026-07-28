import { Hourglass } from "lucide-react";

type Props = { title: string };

export default function WaitingRoom({ title }: Props) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center min-h-80 w-full p-6 mt-35 text-center animate-in fade-in duration-300">

            {/* Badge / Conteneur d'icône avec effet Glow Néon */}
            <div className="relative mb-4 flex items-center justify-center p-4 rounded-2xl bg-bg-main border border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Hourglass className="w-10 h-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-[spin_3s_linear_infinite]" />
            </div>

            {/* Titre de la salle / partie */}
            <h2 className="text-xl font-bold uppercase tracking-wide text-slate-100 mb-1">
                {title}
            </h2>

            {/* Message d'attente */}
            <p className="text-sm font-medium tracking-wide text-(--secondary-text) animate-pulse">
                En attente du début de la partie...
            </p>

        </div>
    );
}