import {
  createContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import {
  io,
  type Socket,
} from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ??
  "http://localhost:3000";

// Instance créée UNE SEULE FOIS, en dehors du composant.
// Elle survit aux montages/démontages (StrictMode, navigation, etc.)
let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    console.log(
      "🔌 Création du Socket.IO :",
      SOCKET_URL
    );

    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }

  return socketInstance;
}

export const SocketContext =
  createContext<Socket | null>(null);

export default function SocketProvider({
  children,
}: {
  children: ReactNode;
}) {
  const socketRef = useRef<Socket>(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("🟢 SOCKET CONNECTED");
      console.log("🆔 Socket ID :", socket.id);
      console.log(
        "🚚 Transport :",
        socket.io.engine.transport.name
      );
    };

    const handleConnectError = (error: Error) => {
      console.error(
        "🔴 SOCKET CONNECT ERROR :",
        error.message
      );
    };

    const handleDisconnect = (reason: string) => {
      console.log("🟠 SOCKET DISCONNECTED :", reason);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    console.log("🔌 Socket connecté ?", socket.connected);

    if (!socket.connected) {
      console.log("🔄 Tentative de connexion...");
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);

      // ⚠️ On NE déconnecte PAS le socket ici.
      // Le socket est partagé (instance module-level) et doit
      // rester vivant même si ce Provider se démonte/remonte
      // (StrictMode en dev, changement de route, etc.)
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}