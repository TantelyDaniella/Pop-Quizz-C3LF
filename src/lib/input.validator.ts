import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "L'email est requis")
  .email("Email invalide");

export const usernameSchema = z
  .string()
  .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
  .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
  .regex(/^[a-zA-Z0-9_]+$/, "Caractères autorisés : lettres, chiffres et underscores");

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const avatarUrlSchema = z.string().optional();

export function requiredTextSchema(fieldName: string) {
  return z.string().min(1, `${fieldName} est requis`);
}

export function validateField(schema: z.ZodSchema, value: string) {
  const result = schema.safeParse(value);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message };
  }
  return { success: true, error: undefined };
}
