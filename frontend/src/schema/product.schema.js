import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price required"),
  stock: z.coerce.number().min(0, "Stock required"),
  category: z.string().optional(),
  images: z.any().optional()
});