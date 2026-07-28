import './App.css'
import TanstackProvider from "./provider/TanstackProvider.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import SocketProvider from "./context/SocketContext.tsx";
import {Toaster} from "sonner"
localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImVtYWlsQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTE1NTgyNCwiZXhwIjoxODYyOTE1ODI0fQ.c4-yiQb4bjMos-rLbfflHkJNhhK5c6W-RYANBiOZ1LQ")
function App() {
  return (
    <TanstackProvider>
      <SocketProvider>
          <AppRouter/>
      </SocketProvider>
      <Toaster position="top-right" richColors />
    </TanstackProvider>
  )
}

export default App
