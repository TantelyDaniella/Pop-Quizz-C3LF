import './App.css'
import TanstackProvider from "./provider/TanstackProvider.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import SocketProvider from "./context/SocketContext.tsx";
import AppToaster from "@/components/common/AppToaster.tsx";

function App() {
  return (
    <TanstackProvider>
      <SocketProvider>
          <AppToaster/>
          <AppRouter/>
      </SocketProvider>
    </TanstackProvider>
  )
}

export default App
