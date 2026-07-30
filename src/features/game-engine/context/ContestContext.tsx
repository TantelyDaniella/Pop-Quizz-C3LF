import { createContext, type ReactNode, useContext, useState } from "react";

type Contest = { id: number; title: string; totalQuestions?: number };

type ContestContextType = {
  joinedContest: Contest | null;
  setJoinedContest: (c: Contest | null) => void;
};

const ContestContext = createContext<ContestContextType | null>(null);

export function ContestProvider({ children }: { children: ReactNode }) {
  const [joinedContest, setJoinedContest] = useState<Contest | null>(null);
  return (
    <ContestContext.Provider value={{ joinedContest, setJoinedContest }}>
      {children}
    </ContestContext.Provider>
  );
}

export function useContestContext() {
  const ctx = useContext(ContestContext);
  if (!ctx) throw new Error("useContestContext must be used within ContestProvider");
  return ctx;
}
