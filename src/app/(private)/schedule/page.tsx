import EventForm from "@/components/forms/eventform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export default async function SchedulePage() {
    const { userId, redirectToSignIn } = await auth()
    if (userId == null) return redirectToSignIn()

    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        with: {
            availabilities: {
                orderBy: ({ startTime }, { desc }) => desc(startTime)
            }

        }
    })
    
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>New Event</CardTitle>
            </CardHeader>
            <CardContent>
                Schedule Form
            </CardContent>
        </Card>
    )
}