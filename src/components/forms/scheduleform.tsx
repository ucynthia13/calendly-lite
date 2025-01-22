"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { scheduleFormSchema } from "@/schema/schema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { formatTime, formatTimezone } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Plus } from "lucide-react"
import { Input } from "../ui/input"

type Availability = {
    startTime: string,
    endTime: string,
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export default function ScheduleForm({ schedule }: { schedule?: { timezone: string, availabilities: Availability[] } }) {
    const [timezones, setTimezones] = useState<string[]>([]);

    useEffect(() => {
        const allTimezones = Intl.supportedValuesOf("timeZone")
        setTimezones(allTimezones.slice(0, 5))
    }, []);

    const form = useForm<z.infer<typeof scheduleFormSchema>>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
            availabilities: schedule?.availabilities?.sort((x, y) => formatTime(x.startTime) - formatTime(y.startTime))
        }
    })

    const { append: appendAvailability, remove: removeAvailability, fields: availabilityFields } = useFieldArray({
        name: "availabilities",
        control: form.control
    })

    const groupedAvailabilities = Object.groupBy(availabilityFields.map((availabilityField, index) => ({
        ...availabilityField, index
    })), availability => availability.dayOfTheWeek
    )
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
                                            {timezone}
                                            `${formatTimezone(timezone)}`
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Timezone users will see when booking</FormDescription>
                        </FormItem>
                    )}
                />
                {/* Availabitilies */}
                <div className="grid grid-cols-[auto, 1fr] gap-y-6">
                    {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => (
                        <Fragment key={dayOfWeek}>
                            <div className="capitalize text-sm font-semibold">{dayOfWeek.substring(0, 3)}</div>
                            <div className="flex flex-col gap-2">
                                <Button type="button" className="size-6 p-1" variant="outline" onClick={() => { }}>
                                    <Plus className="size-full" />
                                </Button>
                                {groupedAvailabilities[dayOfWeek]?.map((field, labelIndex) => (
                                    <FormField
                                        control={form.control}
                                        name={`availabilities.${field.index}.startTime`}
                                        render={({ field }) => (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2 items-center">
                                                    <FormItem>
                                                        <FormLabel>Timezone</FormLabel>
                                                        <FormControl>
                                                            <Input className="w-24" aria-label={`${dayOfWeek} Start Time ${labelIndex} ${labelIndex + 1}`} {...field} />
                                                        </FormControl>
                                                        <FormDescription>Timezone users will see when booking</FormDescription>
                                                    </FormItem>
                                                </div>
                                                <FormMessage>
                                                    {form.formState.errors.availabilities?.at?.(field.id)?.root?.message}
                                                </FormMessage>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                        </Fragment>
                    ))}
                </div>

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
