import { z } from "zod";

export const farmSchema = z.object({
  name: z.string().min(1, "O nome da fazenda é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  totalArea: z.coerce
    .number({ invalid_type_error: "Área Total deve ser um número" })
    .min(0, "Área Total deve ser ≥ 0"),
  agriculturalArea: z.coerce
    .number({ invalid_type_error: "Área Agricultável deve ser um número" })
    .min(0, "Área Agricultável deve ser ≥ 0"),
  vegetationArea: z.coerce
    .number({ invalid_type_error: "Área de Vegetação deve ser um número" })
    .min(0, "Área de Vegetação deve ser ≥ 0"),
  producerId: z.string().min(1, "ID do produtor é obrigatório"),
});

export type FarmFormData = z.infer<typeof farmSchema>;
