import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { Loader2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const TERMINAL_TEXT = "linux pop-quizz";

export default function AuthLayout() {
  const [loaded, setLoaded] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(TERMINAL_TEXT.slice(0, i + 1));
      i++;
      if (i >= TERMINAL_TEXT.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="relative flex flex-col md:grid md:grid-cols-2 min-h-screen overflow-hidden bg-(--bg-main)">

        {/* Glow ambiant */}
        <div className="absolute -top-60 left-1/4 w-175 h-175 rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 rounded-full bg-[#00e5c4]/5 blur-[100px] pointer-events-none" />

        {/* Grille terminal overlay */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Colonne gauche */}
        <div className="relative flex flex-col items-center justify-center gap-8 px-10 py-12">

          {/* Badge événement */}
          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full border dark:border-lime-400/30 border-lime-600/30 bg-lime-400/5 self-start"
          >
            <span className="text-xs dark:text-lime-400 text-lime-600 animate-pulse font-medium tracking-widest uppercase">C3LF × AEENI</span>
          </motion.div>

          {/* Titre terminal */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="self-start relative"
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-[#7c5cfc]" />
              <span className="text-xs text-secondary-text font-mono">pop-quizz ~ v1.0</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl  leading-tight">
              <span className="text-[#7c5cfc]">$</span>{" "}
              <span>{typed}</span>
              <span className="inline-block w-0.5 h-8 bg-primary ml-1 animate-pulse align-middle" />
            </h1>
            <p className="mt-3 text-sm text-secondary-text max-w-xs">
              Une compétition de quiz autour de Linux — commandes, shell, culture générale.
            </p>
          </motion.div>

          {/* Robot */}
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="hidden md:block absolute w-80 h-80 right-0"
          >
            {!loaded && (
                <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#7c5cfc]" />
                  <span className="text-xs text-white/30">chargement...</span>
                </div>
            )}
            <Spline onLoad={() => setLoaded(true)} scene="https://prod.spline.design/8BrPvKBZjih6N06J/scene.splinecode" />
          </motion.div>
        </div>

        {/* Colonne droite */}
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center px-6 py-10 border-l border-white/5"
        >
          <Outlet />
        </motion.div>
      </div>
  );
}