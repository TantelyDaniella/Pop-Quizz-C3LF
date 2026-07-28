import { Outlet } from "react-router-dom";
import PlayerHeader from "./PlayerHeader";
import ContestSidebar from "@/features/game-engine/components/ContestSidebar";
import { ContestProvider } from "@/features/game-engine/context/ContestContext";
import {Swords} from "lucide-react";

export default function PlayerLayout() {
  return (
      <ContestProvider>
        <div className="h-screen flex flex-col bg-(--bg-main)">
          <div className="sticky top-0 z-20">
            <PlayerHeader />
          </div>
          <div className="flex flex-1 overflow-hidden">
            <aside className="sticky top-0 h-full w-72 shrink-0 border-r border-(--border-color) p-3 flex flex-col gap-3 overflow-y-auto">
              <p className="flex items-center gap-2 pb-4">
                <Swords className="bg-orange-500/20 text-orange-500 p-1 w-8 h-8 rounded-lg" />
                <span className="text-xs uppercase tracking-widest text-secondary-text">Parties disponibles</span>
              </p>
              <ContestSidebar />
            </aside>
            <main className="flex-1 overflow-auto bg-[url('/gradient.png')]">
              <Outlet />
            </main>
          </div>
        </div>
      </ContestProvider>
  );
}
