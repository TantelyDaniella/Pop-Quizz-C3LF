import {useEffect, useState} from "react";
import { User, Mail, Lock } from "lucide-react";
import FormInput from "@/components/common/FormInput";
import AvatarPicker from "@/components/common/AvatarPicker";
import { emailSchema, usernameSchema, passwordSchema, validateField } from "@/lib/input.validator";
import FormContainer from "./FormContainer.tsx";
import ValidationDialog from "@/components/common/ValidationDialog.tsx";
import { useRegister } from "../hooks/useAuth.ts";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { register, isPending, isSuccess, error } = useRegister();

  const v = {
    username: validateField(usernameSchema, username),
    email: validateField(emailSchema, email),
    password: validateField(passwordSchema, password),
    avatarUrl: { success: !!avatarUrl, error: "Veuillez choisir un avatar" },
  };

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isPending || !!error) setShowDialog(true);
  }, [isPending, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(v).some(r => !r.success)) return;
    register({ username, email, password, avatarUrl });
  };

  return (
      <FormContainer title="Inscription">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <div className="flex items-center gap-2">
            <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} />
            <span className="text-xs text-secondary-text">Choisissez votre avatar</span>
          </div>
          {submitted && !v.avatarUrl.success && (
              <span className="text-xs text-red-500">{v.avatarUrl.error}</span>
          )}
          <FormInput label="Nom d'utilisateur" value={username} onChange={setUsername}
                     icon={User} placeholder="Votre nom d'utilisateur"
                     isError={submitted && !v.username.success} errorMessage={v.username.error} />
          <FormInput label="Email" type="email" value={email} onChange={setEmail}
                     icon={Mail} placeholder="Votre email"
                     isError={submitted && !v.email.success} errorMessage={v.email.error} />
          <FormInput label="Mot de passe" type="password" value={password} onChange={setPassword}
                     icon={Lock} placeholder="Votre mot de passe"
                     isError={submitted && !v.password.success} errorMessage={v.password.error} />
          <button type="submit" className="btn-primary">S'inscrire</button>
        </form>
        <ValidationDialog
            xCloseButton={false}
            open={showDialog}
            isPending={isPending}
            isSuccess={isSuccess}
            error={(error as any)?.message}
            loadingMessage="Inscription en cours..."
            successMessage="Compte créé avec succès !"
            autoClose={true}
            autoCloseDelay={2000}
            onClose={() => setShowDialog(false)}
        />
      </FormContainer>
  );
}