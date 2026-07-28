import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationContextType {
    page: string;
    navigateTo: (path: string | undefined) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [page, setPage] = useState(location.pathname);

    useEffect(() => {
        setPage(location.pathname);
    }, [location.pathname]);

    const navigateTo = (path: string | undefined) => {
        if (path) navigate(path);
    };

    return (
        <NavigationContext.Provider value={{ page, navigateTo }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
    return context;
};