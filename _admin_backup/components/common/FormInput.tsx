import { useState, type ComponentType, type SVGProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    icon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    isError?: boolean;
    errorMessage?: string;
};

export default function FormInput({
                                      icon: Icon = null,
                                      label,
                                      type = "text",
                                      value,
                                      onChange,
                                      placeholder,
                                      isError = false,
                                      errorMessage,
                                  }: Props) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-1">
            <label className="small-text text-xs">{label}</label>
            <div className="relative">
                {Icon && <Icon className="w-5 h-5 shrink-0 absolute top-2 left-2" />}
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={isError}
                    className={isError ? "ring-2 ring-red-500" : ""}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((prev) => !prev)}
                        className="absolute top-2 right-5"
                    >
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {isError && errorMessage && (
                <span className="text-xs text-red-500">{errorMessage}</span>
            )}
        </div>
    );
}