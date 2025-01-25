import ScheduleForm from "@/components/forms/scheduleform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";

export default async function SchedulePage() {
    const { userId, redirectToSignIn } = await auth()
    if (userId == null) return redirectToSignIn()

    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        with: {
            availabilities: true
        }
    })

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>New Event</CardTitle>
            </CardHeader>
            <CardContent>
                <ScheduleForm schedule={schedule} />
            </CardContent>
        </Card>
    )
}