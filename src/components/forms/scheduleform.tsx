"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { scheduleFormSchema } from "@/schema/schedule"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { formatTime, formatTimezone } from "@/lib/formatters"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { saveSchedule } from "@/server/actions/schedule"

type Availability = {
    startTime: string,
    endTime: string,
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export default function ScheduleForm({ schedule }: { schedule?: { timezone: string, availabilities: Availability[] } }) {
    const [timezones, setTimezones] = useState<string[]>([])
    const [successMessage, setSuccessMessage] = useState<string>()

    useEffect(() => {
        const allTimezones = Intl.supportedValuesOf("timeZone")
        setTimezones(allTimezones)
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

    const groupedAvailabilityFields = Object.groupBy(availabilityFields.map((availabilityField, index) => ({
        ...availabilityField, index
    })), availability => availability.dayOfWeek
    )
    const onSubmit = async (values: z.infer<typeof scheduleFormSchema>) => {
        const data =  await saveSchedule(values)

        if(data?.error){
            form.setError("root", {
                message: "Error Saving Schedule"
            })
        }else{
            setSuccessMessage("Schedule Saved Successfully!")
        }

    }

    return (
        <Form {...form}>
            {form.formState.errors.root && (
                <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                {successMessage && (
                    <div className="text-green-400 text-sm border rounded-md p-2">
                        {successMessage}
                    </div>
                )}
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
                                            {` `}
                                            {formatTimezone(timezone)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Timezone users will see when booking</FormDescription>
                        </FormItem>
                    )}
                />
                {/* Availabitilies */}
                <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
                    {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => (
                        <Fragment key={dayOfWeek}>
                            <div className="capitalize text-sm font-semibold">
                                {dayOfWeek}
                            </div>
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="button"
                                    className="size-full px-4 opacity-80"
                                    variant="outline"
                                    onClick={() => {
                                        appendAvailability({
                                            dayOfWeek,
                                            startTime: "8:00",
                                            endTime: "17:00",
                                        })
                                    }}
                                >

                                    Add schedule <Plus className="size-full" />
                                </Button>
                                {groupedAvailabilityFields[dayOfWeek]?.map(
                                    (field, labelIndex) => (
                                        <div className="flex flex-col gap-1" key={field.id}>
                                            <div className="flex gap-2 items-center">
                                                <FormField
                                                    control={form.control}
                                                    name={`availabilities.${field.index}.startTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="w-24"
                                                                    aria-label={`${dayOfWeek} Start Time ${labelIndex + 1
                                                                        }`}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                -
                                                <FormField
                                                    control={form.control}
                                                    name={`availabilities.${field.index}.endTime`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="w-24"
                                                                    aria-label={`${dayOfWeek} End Time ${labelIndex + 1
                                                                        }`}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />  
                                                <Button
                                                    type="button"
                                                    className="size-6 p-1"
                                                    variant="destructiveGhost"
                                                    onClick={() => removeAvailability(field.index)}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                            <FormMessage>
                                                {
                                                    form.formState.errors.availabilities?.at?.(
                                                        field.index
                                                    )?.root?.message
                                                }
                                            </FormMessage>
                                            <FormMessage>
                                                {
                                                    form.formState.errors.availabilities?.at?.(
                                                        field.index
                                                    )?.startTime?.message
                                                }
                                            </FormMessage>
                                            <FormMessage>
                                                {
                                                    form.formState.errors.availabilities?.at?.(
                                                        field.index
                                                    )?.endTime?.message
                                                }
                                            </FormMessage>
                                        </div>
                                    )
                                )}
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
