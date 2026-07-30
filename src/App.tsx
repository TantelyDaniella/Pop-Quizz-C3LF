import './App.css'
import TanstackProvider from "./app/provider/TanstackProvider";
import AppRouter from "./routes/app.router";
import SocketProvider from "./app/context/SocketContext";
import AppToaster from "@/components/common/AppToaster";

function App() {
  return (
    <TanstackProvider>
      <SocketProvider>
        <AppToaster />
        <AppRouter />
      </SocketProvider>
    </TanstackProvider>
  )
}

export default App
