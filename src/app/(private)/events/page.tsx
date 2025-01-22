import CopyEventButton from "@/components/copyeventbutton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (userId == null) return redirectToSignIn()

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt)
  })
  return (
    <div className="min-h-screen">
      <div className="flex flex-row justify-between py-4">
        <h4 className="font-bold text-md">Welcome To Your Events</h4>
        {events.length > 0 ? (
          <Button asChild>
            <Link href="/events/new">
              <CalendarRange className="size-16" />
              Create Event
            </Link>
          </Button>
        ) : ""}
      </div>
      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-4">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
        ) : (
        <div className="flex flex-col items-center gap-4">
          <CalendarPlus className="size-16 mx-auto" />
          <p className="text-center">You have no events yet. Create your first event to get started!</p>
          <Button asChild>
            <Link href="/events/new">
              <CalendarRange className="size-16" />
              Create Event
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

type EventCardProps ={
  id: string, 
  name: string,
  description: string | null, 
  duration: number,
  clerkUserId: string,
  isActive: boolean
}


function EventCard(
  {id, name, description, isActive, duration, clerkUserId} : EventCardProps
) {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className={cn(!isActive && "opacity-50")}>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardDescription className={cn(!isActive && "opacity-50", "ml-6")}>
        {formatDuration(duration)}
      </CardDescription>
      {description && (
        <CardContent className={cn("text-md",!isActive && "opacity-50")}>
          {description}
        </CardContent>
      )}
      <CardFooter className="flex flex-row justify-end gap-2 mt-auto">
        {isActive && <CopyEventButton eventId={id} clerkUserId={clerkUserId} variant="outline"/>}
        <Button asChild>
          <Link href={`/events/edit/${id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}