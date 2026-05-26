import { z } from "zod";

const emailSchema = z
  .string({ message: "El correo es obligatorio" })
  .trim()
  .min(1, "El correo es obligatorio")
  .email("Ingresa un correo valido");

const nombreSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre es demasiado largo");

/**
 * Honeypot: campo oculto "website". Debe llegar vacio.
 * Si trae valor, es bot y rechazamos.
 */
const honeypot = z
  .string()
  .max(0, "Solicitud invalida")
  .optional()
  .or(z.literal(""));

export const subscribeSchema = z.object({
  email: emailSchema,
  website: honeypot,
  source: z.string().trim().max(64).optional(),
  pilar: z.string().trim().max(32).optional(),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const leadMagnetSchema = z.object({
  email: emailSchema,
  leadMagnetSlug: z
    .string({ message: "Falta el identificador del recurso" })
    .trim()
    .min(1, "Falta el identificador del recurso")
    .max(120),
  nombre: nombreSchema.optional(),
  website: honeypot,
});
export type LeadMagnetInput = z.infer<typeof leadMagnetSchema>;

export const contactSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  mensaje: z
    .string({ message: "El mensaje es obligatorio" })
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(4000, "El mensaje es demasiado largo"),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const consultationSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  mensaje: z
    .string({ message: "Cuentame brevemente sobre tu proyecto" })
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(4000, "El mensaje es demasiado largo"),
  slot: z.string().trim().max(80).optional(),
  website: honeypot,
});
export type ConsultationInput = z.infer<typeof consultationSchema>;
