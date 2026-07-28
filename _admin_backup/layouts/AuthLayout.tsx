import { useState } from "react";
import { Outlet } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative grid grid-cols-2 min-h-screen overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-(--primary)/15 blur-[120px] pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center bg-[url('/src/assets/images/gradient.png')]">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-65 h-65 rounded-xl"
                >
                    {!loaded && (
                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="text-xs opacity-50">chargement...</span>
                        </div>
                    )}
                    <Spline
                        onLoad={() => setLoaded(true)}
                        scene="https://prod.spline.design/8BrPvKBZjih6N06J/scene.splinecode"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="relative surface-card backdrop-blur-sm"
                >
          <span className="text-lg">
            Bonjour ! bienvenue sur{" "}
              <span className="big-title text-2xl! text-primary">linux pop-quizz.</span>
          </span>
                    <br />
                    <p className="text-sm text-(--primary-text-color)/65">
                        un evenement organisé par <span className="text-primary">C3LF</span> et l'
                        <span className="text-primary">AEENI</span>.
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="relative flex items-center justify-center bg-[url('/src/assets/images/gradient.png')]"
            >
                <Outlet />
            </motion.div>
        </div>
    );
}