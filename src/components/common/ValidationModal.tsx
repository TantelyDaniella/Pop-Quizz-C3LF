import { useNavigation } from "../../context/NavigationContext.tsx";
import { ThreeDots } from "react-loader-spinner";
import Modal from "./Modal.tsx";

type Status = "idle" | "pending" | "success" | "error";

type Props = {
    status: Status;

    type?: "login" | "default";

    onClose?: () => void;

    messages?: {
        loadingTitle?: string;
        loadingDesc?: string;
        successTitle?: string;
        successDesc?: string;
        failureTitle?: string;
        failureDesc?: string;
    };
};

export default function ValidationModal({
                                            status,
                                            type = "default",
                                            onClose,
                                            messages = {},
                                        }: Props) {
    const { navigateTo } = useNavigation();

    const handleAction = () => {
        if (type === "login") {
            navigateTo("/login");
            return;
        }

        onClose?.();
    };

    return (
        <Modal type={status === "error" ? "error" : "default"}>
            <div className="text-center p-4 relative min-h-32">
                {status === "pending" && (
                    <>
                        <h2 className="font-bold text-xl mb-1">
                            {messages.loadingTitle ??
                                "Veuillez patienter !"}
                        </h2>

                        <p className="text-xs text-gray-500">
                            {messages.loadingDesc ??
                                "Envoi en cours..."}
                        </p>

                        <div className="flex justify-center mt-4">
                            <ThreeDots color="var(--primary)" />
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="font-bold text-xl mb-1">
                            {messages.successTitle ??
                                "Opération réussie !"}
                        </h2>

                        <p className="text-xs text-gray-500 mb-10">
                            {messages.successDesc ??
                                "Votre demande a été traitée avec succès."}
                        </p>

                        <button
                            className="btn-primary absolute right-2 bottom-2"
                            onClick={handleAction}
                        >
                            {type === "login"
                                ? "Se connecter"
                                : "Fermer"}
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 className="font-bold text-xl mb-1">
                            {messages.failureTitle ??
                                "Échec !"}
                        </h2>

                        <p className="text-xs text-gray-500 mb-10">
                            {messages.failureDesc ??
                                "Une erreur est survenue. Veuillez réessayer."}
                        </p>

                        <button
                            className="bg-red-500 text-white px-3 py-2 rounded-lg absolute right-2 bottom-2"
                            onClick={handleAction}
                        >
                            {type === "login"
                                ? "Quitter"
                                : "Fermer"}
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
}