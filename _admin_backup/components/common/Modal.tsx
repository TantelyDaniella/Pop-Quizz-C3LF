import logo from "../../assets/images/logo.svg";
import {Portal} from "./Portal.tsx";


type Props = {
    children: React.ReactNode;
    type?: "default" | "error";
};

export default function Modal({ children, type = "default" }: Props) {
    return (
        <Portal>
            <div className="fixed inset-0 z-500 bg-black/20 backdrop-blur-[3px] overflow-y-auto">
                <div className="relative min-h-screen flex items-center justify-center p-4">
                    <div className="relative md:w-100 w-[85vw] px-4 py-4 surface-card rounded-lg">
                        <img src={logo} alt="logo" className={`w-6 h-6 absolute left-2 top-2 dark:hidden ${type === "error" ? "grayscale" : ""}`} />
                          {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
}