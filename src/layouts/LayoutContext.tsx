import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import useSocket from "@/features/game-engine/hooks/useSocket";

type LayoutContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  newGamesCount: number;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const [newGamesCount, setNewGamesCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const onCreated = () => {
      setNewGamesCount((prev) => prev + 1);
    };

    socket.on("created-game", onCreated);
    return () => { socket.off("created-game", onCreated); };
  }, [socket]);

  const openSidebar = () => {
    setSidebarOpen(true);
    setNewGamesCount(0);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (next) setNewGamesCount(0);
      return next;
    });
  };

  return (
    <LayoutContext.Provider
      value={{ sidebarOpen, toggleSidebar, closeSidebar, newGamesCount }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayoutContext must be used within LayoutProvider");
  return ctx;
}
