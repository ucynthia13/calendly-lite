
import { z } from "zod";

export const eventFormSchema = z.object({
    name: z.string().min(1, "Required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    duration: z.coerce.number().positive("Duration has to be greater than zero").max(60 * 12, `Duration has to be less than 12 hours (${60 * 12}) minutes`)
})
