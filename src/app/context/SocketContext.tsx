import { createContext, type ReactNode, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { mockSocket } from "@/features/game-engine/mocks/socket.mock";
import APP_CONFIG from "../../../app.config";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
    `http://${APP_CONFIG.API_CONFIG.hostname}:${APP_CONFIG.API_CONFIG.port}`;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const SocketContext = createContext<Socket>({} as Socket);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<Socket>(() =>
      USE_MOCK ? (mockSocket as unknown as Socket) : io(SOCKET_URL, { autoConnect: false })
  );

  useEffect(() => {
    if (USE_MOCK) {
      console.log("Using mock socket — no real backend connection");
    } else {
      console.log("Connecting to real socket at", SOCKET_URL);
      socket.on("connect", () => console.log("Socket connected:", socket.id));
      socket.on("disconnect", () => console.log("Socket disconnected"));
      socket.on("connect_error", (err) => console.log("Socket connection error:", err.message));
      socket.connect();
    }

    return () => {
      if (!USE_MOCK) socket.disconnect();
    };
  }, [socket]);

  return (
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}