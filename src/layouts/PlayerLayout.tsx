import { Outlet } from "react-router-dom";
import PlayerHeader from "./PlayerHeader";
import ContestSidebar from "@/features/game-engine/components/ContestSidebar";
import { ContestProvider, useContestContext } from "@/features/game-engine/context/ContestContext";
import { LayoutProvider, useLayoutContext } from "./LayoutContext";
import { useContests, type Contest } from "@/features/game-engine/hooks/useContest";
import { Swords, X } from "lucide-react";
import { useEffect } from "react";

function MobileDrawer({ contests }: { contests: Contest[] }) {
  const { sidebarOpen, closeSidebar } = useLayoutContext();
  const { joinedContest } = useContestContext();

  useEffect(() => {
    if (joinedContest) closeSidebar();
  }, [joinedContest, closeSidebar]);

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={closeSidebar} />
      <aside className="absolute left-0 top-0 bottom-0 w-72 bg-(--bg-main) border-r border-(--border-color) p-3 flex flex-col gap-3 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-2">
          <p className="flex items-center gap-2">
            <Swords className="bg-orange-500/20 text-orange-500 p-1 w-8 h-8 rounded-lg" />
            <span className="text-xs uppercase tracking-widest text-secondary-text">Parties disponibles</span>
          </p>
          <button onClick={closeSidebar} className="p-1.5 rounded-lg hover:bg-(--input-bg) border border-(--border-color) transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ContestSidebar contests={contests} />
      </aside>
    </div>
  );
}

function LayoutInner() {
  const { joinedContest } = useContestContext();
  const { contests } = useContests();

  return (
    <div className="h-screen flex flex-col bg-(--bg-main)">
      <div className="sticky top-0 z-20">
        <PlayerHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — always visible on md+ */}
        <aside className="hidden md:flex sticky top-0 h-full w-72 shrink-0 border-r border-(--border-color) p-3 flex-col gap-3 overflow-y-auto">
          <p className="flex items-center gap-2 pb-4">
            <Swords className="bg-orange-500/20 text-orange-500 p-1 w-8 h-8 rounded-lg" />
            <span className="text-xs uppercase tracking-widest text-secondary-text">Parties disponibles</span>
          </p>
          <ContestSidebar contests={contests} />
        </aside>

        {/* Mobile drawer */}
        <MobileDrawer contests={contests} />

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[url('/gradient.png')]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function PlayerLayout() {
  return (
    <ContestProvider>
      <LayoutProvider>
        <LayoutInner />
      </LayoutProvider>
    </ContestProvider>
  );
}
