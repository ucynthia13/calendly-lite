"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { scheduleFormSchema } from "@/schema/schema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form"
import { Button } from "../ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { formatTime, formatTimezone } from "@/lib/utils"
import { Select , SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"

type Availability = {
    startTime: string,
    endTime: string,
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export default function ScheduleForm({ schedule }: { schedule?: { timezone: string, availabilities: Availability[] } }) {
    const [timezones, setTimezones] = useState<string[]>([]);

    useEffect(() => {
        const allTimezones = Intl.supportedValuesOf("timeZone")
        setTimezones(allTimezones.slice(0,5))
    }, []);

    const form = useForm<z.infer<typeof scheduleFormSchema>>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
            availabilities: schedule?.availabilities?.sort((x, y) => formatTime(x.startTime) - formatTime(y.startTime))
        }
    })

    const onSubmit = async (values: z.infer<typeof scheduleFormSchema>) => {
        console.log(values.timezone)
    }

    return (
        <Form {...form}>
            {form.formState.errors.root && (
                <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {timezones.map(timezone => (
                                        <SelectItem key={timezone} value={timezone}>
                                            {timezone} {formatTimezone(timezone)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Timezone users will see when booking</FormDescription>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button asChild type="button" variant="outline">
                        <Link href="/events">Cancel</Link>
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    )
}
