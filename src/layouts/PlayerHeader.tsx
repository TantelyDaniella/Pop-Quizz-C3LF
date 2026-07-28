import NotificationPopover from "./NotificationPopover";
import UserPopover from "./UserPopover";
import { useState } from "react";
import { Moon, Sun, Zap } from "lucide-react";

export default function PlayerHeader() {
    const [dark, setDark] = useState(true);
    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
        setDark(prev => !prev);
    };

    return (
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-(--border-color) bg-(--surface)/80 backdrop-blur-md">

            {/* Gauche : logo + titre */}
            <div className="flex items-center gap-3">
                <img src="/linux-pop-quizz.svg" alt="logo" className="w-8 h-8" />
                <h1 className="big-title text-xl hidden sm:block">PopQuizz</h1>
                <div className="hidden md:block w-px h-5 bg-(--border-color)" />
                <div className="hidden md:flex flex-col leading-none">
                    <span className="text-[10px] uppercase tracking-widest text-(--secondary-text)">Mega Event</span>
                    <span className="text-xs font-semibold text-(--primary)">AEENI × C3LF</span>
                </div>
            </div>

            {/* Centre : badge live */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-(--primary)/30 bg-(--primary)/5">
                <Zap className="w-3 h-3 text-(--primary)" />
                <span className="text-xs font-medium text-(--primary) uppercase tracking-widest">Live</span>
            </div>

            {/* Droite : actions */}
            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-(--input-bg) border border-(--border-color) transition-colors cursor-pointer">
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <NotificationPopover />
                <UserPopover />
            </div>
        </header>
    );
}