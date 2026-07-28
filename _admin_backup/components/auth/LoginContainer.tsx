import type {ReactNode} from "react";
import logo from "../../assets/images/linux-pop-quizz.svg"

export default function LoginContainer({children} : { children: ReactNode }) {
    return (
        <div className="p-5! border border-gray-500/30 rounded-lg surface-card backdrop-blur-sm flex flex-col gap-4 ">
            <div className="flex items-end gap-2">
                <img alt={"logo"} src={logo} className="w-8 h-8" />
                <span className="text-primary font-bold text-2xl" >Connexion</span>
            </div>
            {children}
        </div>
    )
}