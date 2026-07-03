import { useEffect, useState } from "react";
import FormInput from "../common/FormInput.tsx";
import { emailSchema, passwordSchema, validateField } from "@/utils/input.validator.ts";
import { Lock, Mail } from "lucide-react";
import LoginContainer from "./LoginContainer.tsx";
import { Link, useNavigate } from "react-router-dom";
import ValidationDialog from "../common/ValidationDialog.tsx";
import { useAuthenticate } from "@/hooks/useAuth.ts";
import toast from "react-hot-toast";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { authenticate, isPending, isSuccess, error } = useAuthenticate();
    const navigate = useNavigate();

    const v = {
        email: validateField(emailSchema, email),
        password: validateField(passwordSchema, password),
    };

    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (isPending || !!error) setShowDialog(true);
    }, [isPending, error]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Vous êtes connecté", {
                position: "top-center",
            });
            navigate("/");
        }
    }, [isSuccess, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.values(v).some(r => !r.success)) return;
        authenticate({ email, password });
    };

    return (
        <LoginContainer>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <FormInput
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Votre email..."
                    isError={submitted && !v.email.success}
                    errorMessage={v.email.error}
                />
                <FormInput
                    label="Mot de passe"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="* * * * * *"
                    isError={submitted && !v.password.success}
                    errorMessage={v.password.error}
                />
                <span className="text-sm">Pas encore de compte ? <Link to={"/register"} className="font-bold underline text-primary" >Cliquez ici</Link></span>
                <button type="submit" className="btn-primary">
                    Se connecter
                </button>
            </form>
            <ValidationDialog
                xCloseButton={false}
                open={showDialog}
                isPending={isPending}
                isSuccess={isSuccess}
                error={(error as any)?.message}
                loadingMessage="Connexion en cours..."
                successMessage="Connexion réussie !"
                autoClose={true}
                autoCloseDelay={2000}
                onClose={() => setShowDialog(false)}
            />
        </LoginContainer>
    );
}