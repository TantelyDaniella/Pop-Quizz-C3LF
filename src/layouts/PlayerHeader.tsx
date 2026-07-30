import UserPopover from "./UserPopover";
import { useState } from "react";
import { Moon, Sun, Zap, PanelLeftClose, PanelLeft, Swords } from "lucide-react";
import { useContestContext } from "@/features/game-engine/context/ContestContext";
import { useLayoutContext } from "./LayoutContext";

export default function PlayerHeader() {
    const [dark, setDark] = useState(true);
    const { joinedContest } = useContestContext();
    const { sidebarOpen, toggleSidebar, newGamesCount } = useLayoutContext();

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
        setDark(prev => !prev);
    };

    return (
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-(--border-color) bg-(--surface)/80 backdrop-blur-md">

            {/* Gauche : logo + titre + toggle sidebar */}
            <div className="flex items-center gap-3">
                {!joinedContest && (
                    <button onClick={toggleSidebar} className="relative p-1.5 rounded-lg hover:bg-(--input-bg) border border-(--border-color) transition-colors cursor-pointer md:hidden">
                        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                        {newGamesCount > 0 && !sidebarOpen && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-(--bg-main)" />
                        )}
                    </button>
                )}
                <img src="/linux-pop-quizz.svg" alt="logo" className="w-8 h-8 shrink-0" />
                <h1 className="big-title text-xl hidden sm:block">PopQuizz</h1>
                {joinedContest && (
                    <>
                        <div className="w-px h-5 bg-(--border-color)" />
                        <Swords className="w-4 h-4 text-(--primary)" />
                        <span className="hidden md:block text-sm font-medium truncate max-w-40">{joinedContest.title}</span>
                    </>
                )}
                <div className="hidden md:block w-px h-5 bg-(--border-color)" />
                <div className="hidden md:flex flex-col leading-none">
                    <span className="text-[10px] uppercase tracking-widest text-(--secondary-text)">Mega Event</span>
                    <span className="text-xs font-semibold text-(--primary)">AEENI × C3LF</span>
                </div>
            </div>

            {/* Centre : badge live */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-(--primary)/30 bg-(--primary)/5">
                <Zap className="w-3 h-3 text-(--primary)" />
                <span className="text-xs font-medium text-(--primary) uppercase tracking-widest">Live</span>
            </div>

            {/* Droite : actions */}
            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-(--input-bg) border border-(--border-color) transition-colors cursor-pointer">
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                
                <UserPopover />
            </div>
        </header>
    );
}
