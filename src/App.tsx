import './App.css'
import TanstackProvider from "./provider/TanstackProvider.tsx";
import AppRouter from "./routes/AppRouter.tsx";

function App() {
  return (
    <TanstackProvider>
      <AppRouter/>
    </TanstackProvider>
  )
}

export default App
