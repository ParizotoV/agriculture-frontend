import { z } from "zod";

export const cropSchema = z.object({
  farmId: z.string().min(1, "A fazenda é obrigatória"),
  cultureName: z.string().min(1, "O nome da cultura é obrigatório"),
  season: z.string().min(1, "A safra é obrigatória"),
  harvestQuantity: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val.replace(",", "."));
        return !isNaN(num) && num >= 0;
      },
      { message: "Colheita deve ser um número ≥ 0." }
    ),
  priceReceived: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const clean = val.replace(/[^0-9,-]/g, "").replace(",", ".");
        const num = parseFloat(clean);
        return !isNaN(num) && num >= 0;
      },
      { message: "Preço Recebido deve ser um número ≥ 0." }
    ),
});

export type CropFormData = z.infer<typeof cropSchema>;
