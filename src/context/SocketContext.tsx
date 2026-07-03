import { createContext, useEffect, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

export const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
    const socketRef = useRef<Socket | null>(null);

    if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, { withCredentials: true, autoConnect: true });
    }

    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
}