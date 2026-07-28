import { createContext, type ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavigationContextType = {
  page: string;
  navigateTo: (path: string) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <NavigationContext.Provider value={{ page: location.pathname, navigateTo: navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
