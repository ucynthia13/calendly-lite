import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { formatTime } from "@/lib/utils";
import { z } from "zod";

export const eventFormSchema = z.object({
    name: z.string().min(1, "Required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    duration: z.coerce.number().positive("Duration has to be greater than zero").max(60 * 12, `Duration has to be less than 12 hours (${60 * 12}) minutes`)
})

export const scheduleFormSchema = z.object({
    timezone: z.string().min(1, "Required"),
    availabilities: z.array(
        z.object({
            dayOfTheWeek: z.enum(DAYS_OF_WEEK_IN_ORDER),
            startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, should be HH:MM"),
            endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, should be HH:MM")

        })
    ).superRefine((availabilities, ctx) => {
        availabilities.forEach((availability, index) => {
            const overlaps = availabilities.some((a, i) => {
                return i !== index && a.dayOfTheWeek === availability.dayOfTheWeek && formatTime(a.startTime) < formatTime(availability.endTime) && formatTime(a.endTime) > formatTime(availability.startTime)
            })
            if (overlaps) {
                ctx.addIssue({
                    code: "custom",
                    message: "Availablity overlaps another",
                    path: [index]
                })
            }
            if (formatTime(availability.startTime) >= formatTime(availability.endTime)) {
                ctx.addIssue({
                    code: "custom",
                    message: "End Time can not be less than or equal to Start Time",
                    path: [index]
                })
            }
        });
    })
})
