import { z } from "zod";

 const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .optional(),

  price: z
    .coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be at least 0"),

  stock: z
    .coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock must be at least 0"),

  category: z
    .string()
    .optional(),

  images: z
    .array(
      z.object({
        secureUrl: z.string().url("Image must have a valid URL"),
        publicId: z.string().min(1, "Public ID is required")
      })
    )
    .optional()
});

export { productSchema };
