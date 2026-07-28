import { AlertTriangle, X } from "lucide-react";
import { Portal } from "./Portal";

type ConfirmModalVariant = "danger" | "warning" | "default";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: ConfirmModalVariant;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  const iconStyles = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-yellow-100 text-yellow-600",
    default: "bg-gray-100 text-gray-600",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-200",
    warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-200",
    default: "bg-gray-700 hover:bg-gray-800 focus:ring-gray-200",
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                iconStyles[variant]
              }`}
            >
              <AlertTriangle size={22} />
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                buttonStyles[variant]
              }`}
            >
              {isLoading ? "Traitement..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}