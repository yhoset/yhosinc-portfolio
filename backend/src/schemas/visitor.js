import { z } from "zod";

export const visitorRegisterSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(200),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(200),
});

export const visitorLoginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
