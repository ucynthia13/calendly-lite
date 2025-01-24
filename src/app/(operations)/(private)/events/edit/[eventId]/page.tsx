import EventForm from "@/components/forms/eventform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface PageProps{
    params:{
        eventId: string
    }
}

export default async function EventEditPage({ params }: PageProps){
    const { userId, redirectToSignIn } = await auth()
    if(userId == null) return redirectToSignIn()
    const event = await db.query.EventTable.findFirst({
        where: ({ id, clerkUserId}, {and, eq}) => and(eq(clerkUserId, userId), eq(id, params.eventId))
    })

    if(!event) return notFound()

    return(
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Edit Event</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm event={{...event, description: event?.description || undefined }}/>
            </CardContent>
        </Card>
    )
}