import './App.css'
import TanstackProvider from "./provider/TanstackProvider.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import SocketProvider from "./context/SocketContext.tsx";

function App() {
  return (
    <TanstackProvider>
      <SocketProvider>
          <AppRouter/>
      </SocketProvider>
    </TanstackProvider>
  )
}

export default App
