"use client"

import {  z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { eventFormSchema } from "@/schema/schema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { Switch } from "../ui/switch"
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { useState, useTransition } from "react"
import { AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

export default function EventForm({ event}: {event? : {
    id: string
    name: string
    description?: string
    duration: number
    isActive: boolean
}}){
    const [isDeletePending, BeginDeleteTransition] = useTransition()
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ?? {
            isActive: true,
            duration: 30
        }
    })
    const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        const data = await action(values)

        if(data?.error){
            form.setError("root", {
                message: "There was an error saving your data"
            })
        }
    }
    return(
        
        <Form {...form}>
            {form.formState.errors.root &&(
                <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field}) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormDescription> Name Users have to see when booking</FormDescription>
                        </FormItem>
                    )}
                 />
                 <FormField 
                 control={form.control}
                 name="duration"
                 render={({ field}) => (
                    <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Event Duration</FormDescription>
                    </FormItem>
        
                 )}
                 />
                <FormField 
                control={form.control}
                name="description"
                render={({ field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input {...field} className="resize-none h-32"/>
                        </FormControl>
                        <FormDescription>Event Description</FormDescription>
                    </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="isActive"
                render={({ field}) => (
                    <FormItem>
                        <div className="flex items-center gap-3">
                            <FormControl>
                                <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Status</FormLabel>
                        </div>
                        <FormDescription>Inactive events will not be visible for users to book</FormDescription>

                    </FormItem>
                )}
                />
                 <div className="flex justify-end gap-2">
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructiveGhost" disabled={form.formState.isSubmitting || isDeletePending}>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                    Are you sure?
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogContent>
                                    This action can not be undone. This will permanently delete the event
                                </AlertDialogContent>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction  disabled={isDeletePending || form.formState.isSubmitting}
                                    onClick={async () => {
                                        BeginDeleteTransition(async () => {
                                            const data = await deleteEvent(event.id)
                                            if(data?.error){
                                                form.setError("root", {
                                                    message: "There was error deleting your event"
                                                })
                                            }
                                        })
                                    }}>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button asChild type="button" variant="outline">
                        <Link href="/events" className="text-black">Cancel</Link>
                    </Button>
                    <Button type="submit">Save</Button>
                 </div>
            </form>
        </Form>
    )
}