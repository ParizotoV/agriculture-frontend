import { z } from "zod";

export const producerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres." }),
  cpfCnpj: z
    .string()
    .regex(/^\d+$/, { message: "Apenas dígitos são permitidos." })
    .refine((val) => val.length === 11 || val.length === 14, {
      message: "Digite um CPF (11 dígitos) ou CNPJ (14 dígitos).",
    }),
});

export type ProducerFormData = z.infer<typeof producerSchema>;
