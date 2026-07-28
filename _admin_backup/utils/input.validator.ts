import { z } from "zod";

export const emailSchema = z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide");

export const usernameSchema = z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne doit pas dépasser 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et underscores uniquement");

export const passwordSchema = z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const requiredTextSchema = (label: string) =>
    z.string().min(1, `${label} est requis`);

export const avatarUrlSchema = z
    .string()
    .url("URL d'avatar invalide")
    .optional()
    .or(z.literal(""));

export function validateField(
    schema: z.ZodTypeAny,
    value: unknown
): { success: boolean; error?: string } {
    const result = schema.safeParse(value);
    if (result.success) return { success: true };
    return { success: false, error: result.error.issues[0]?.message };
}