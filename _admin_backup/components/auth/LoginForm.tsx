import { useState } from "react";
import FormInput from "../common/FormInput.tsx";
import { usernameSchema, passwordSchema, validateField } from "../../utils/input.validator.ts";
import {UserRound, Lock} from "lucide-react";
import LoginContainer from "./LoginContainer.tsx";
import {Link} from "react-router-dom";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const usernameResult = validateField(usernameSchema, username);
    const passwordResult = validateField(passwordSchema, password);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!usernameResult.success || !passwordResult.success) return;

        // TODO: appel API de login (services/auth.service.ts)
    };

    return (
        <LoginContainer>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <FormInput
                    label="Nom d'utilisateur"
                    icon={UserRound}
                    value={username}
                    onChange={setUsername}
                    placeholder="Votre nom d'utilisateur..."
                    isError={submitted && !usernameResult.success}
                    errorMessage={usernameResult.error}
                />
                <FormInput
                    label="Mot de passe"
                    icon={Lock}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="* * * * * *"
                    isError={submitted && !passwordResult.success}
                    errorMessage={passwordResult.error}
                />
                <span className="text-sm">Pas encore de compte ? <Link to={"/register"} className="font-bold underline text-primary" >Cliquez ici</Link></span>
                <button type="submit" className="btn-primary">
                    Se connecter
                </button>
            </form>
        </LoginContainer>
    );
}