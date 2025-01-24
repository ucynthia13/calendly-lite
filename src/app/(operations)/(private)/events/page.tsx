import CopyEventButton from "@/components/copyeventbutton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { db } from "@/drizzle/db";
import { formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange, LucideMailQuestion, MessageCircleQuestion, Settings, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (userId == null) return redirectToSignIn()

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt)
  })

  const calendarUser = (await clerkClient()).users.getUser(userId)
  return (
    <div className="">
      <div className="flex items-center space-x-2">
        <h4 className="font-bold text-3xl">Your Events</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <MessageCircleQuestion className="size-4 opacity-50" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Events Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
      <div className="flex flex-row justify-between py-8">
        <div className="flex gap-4">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "size-10" } }}/>
          <div className="opacity-80 text-sm gap-2">
            <p className="font-bold">{(await calendarUser).fullName}</p>
            <p className="text-primary cursor-pointer"> https://calendly-like.vercel.app/cynthiaumwali3</p>
          </div>
        </div>
        {events.length > 0 && (
          <Button asChild>
            <Link href="/events/new">
              <CalendarRange className="size-16" />
              Create Event
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      {events.length > 0 ? (
        <div className="grid gap-4 grid-cols-3 pt-8">
          {events.map(event => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-8">
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

type EventCardProps = {
  id: string,
  name: string,
  description: string | null,
  duration: number,
  clerkUserId: string,
  isActive: boolean
}


function EventCard(
  { id, name, description, isActive, duration, clerkUserId }: EventCardProps,
) {
  return (
    <Card className="flex flex-col shadow-sm hover:shadow-md">
      <CardHeader className={cn(!isActive && "opacity-50")}>
        <div className="flex flex-row justify-between">
          <Checkbox />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Settings className="size-5 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <DropdownMenuLabel>Event Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
              <DropdownMenuItem>Clone</DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex flex-row justify-between p-2">
                <span>On/Off</span>
                <Switch />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-md">{name}</CardTitle>
        <CardDescription>
          {formatDuration(duration)}
        </CardDescription>
      </CardHeader>
      {description != null && (
        <CardContent className={cn("text-md", !isActive && "opacity-50")}>
          {description}
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        {isActive && (
          <CopyEventButton
            variant="outline"
            eventId={id}
            clerkUserId={clerkUserId}
          />
        )}
        <Button asChild className="rounded-md">
          <Link href={`/events/edit/${id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}