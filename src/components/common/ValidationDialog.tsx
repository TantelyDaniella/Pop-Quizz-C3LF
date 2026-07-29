import { useEffect } from "react";
import {Loader2, TriangleAlert, CircleCheck} from "lucide-react";
import {Dialog, DialogClose, DialogContent, DialogTitle} from "@/components/ui/dialog";

type Props = {
    open: boolean;
    isPending?: boolean;
    error?: string | null;
    isSuccess?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
    loadingMessage?: string;
    successMessage?: string;
    xCloseButton?: boolean;
    onClose?: () => void;
};

export default function ValidationDialog({
                                             open, isPending, error, isSuccess,
                                             autoClose = true, loadingMessage = "Chargement...",
                                            autoCloseDelay = 3000,
                                             successMessage = "Succès !", xCloseButton = true, onClose
                                         }: Props) {

    useEffect(() => {
        if (!isSuccess || !autoClose) return;
        const t = setTimeout(() => onClose?.(), autoCloseDelay );
        return () => clearTimeout(t);
    }, [isSuccess, autoClose]);

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onClose?.(); }}>
            <DialogContent
                showCloseButton={xCloseButton}
                className="w-[calc(100%-2rem)] max-w-sm rounded-2xl flex flex-col items-center gap-4 py-8 px-6"
            >
                {isPending && (
                    <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <DialogTitle>{loadingMessage}</DialogTitle>
                    </>
                )}
                {isSuccess && (
                    <>
                        <CircleCheck className="w-8 h-8 text-green-500" />
                        <DialogTitle className="">{successMessage}</DialogTitle>
                        {!autoClose && (
                            <button className="btn-primary w-full" onClick={onClose}>Fermer</button>
                        )}
                    </>
                )}
                {error && !isPending && (
                    <>
                        <TriangleAlert className="text-red-500" />
                        <DialogTitle className="">Une erreur est survenue</DialogTitle>
                        <p className="text-sm text-center text-(--secondary-text)">{error}</p>
                        <DialogClose asChild>
                            <button className="btn-primary w-full">Fermer</button>
                        </DialogClose>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}