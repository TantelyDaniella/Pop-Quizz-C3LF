import { useState, type ComponentType, type SVGProps } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
};

export default function ConfirmDialog({ open, onOpenChange, icon: Icon, title, message, onConfirm }: Props) {
    const [pending, setPending] = useState(false);

    const handleConfirm = async () => {
        setPending(true);
        await onConfirm();
        setPending(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="w-[calc(100%-2rem)] max-w-sm rounded-2xl flex flex-col items-center gap-4 py-8 px-6"
            >
                {pending ? (
                    <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-(--secondary-text)">Veuillez patienter...</p>
                    </>
                ) : (
                    <>
                        <Icon className="w-8 h-8 text-primary" />
                        <DialogTitle>{title}</DialogTitle>
                        <p className="text-sm text-center text-(--secondary-text)">{message}</p>
                        <div className="flex md:flex-row flex-col gap-3 w-full">
                            <button className="btn-outline flex-1 py-2 text-sm" onClick={() => onOpenChange(false)}>
                                Annuler
                            </button>
                            <button className="btn-primary flex-1" onClick={handleConfirm}>
                                Confirmer
                            </button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}