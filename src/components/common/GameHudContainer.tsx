import type { ReactNode } from "react";

type GameHudContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function GameHudContainer({ children, className = "" }: GameHudContainerProps) {
    return (
        <div className={`relative w-full h-full rounded-2xl border border-orange-500/20 shadow-[0_0_25px_rgba(249,115,22,0.1)] transition-all duration-300 ${className}`}>
            {/* Coins décoratifs style HUD / Gamer */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500 rounded-bl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500 rounded-br-2xl pointer-events-none" />

            {/* Halos lumineux en arrière-plan (glows subtils) */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Contenu actif */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}