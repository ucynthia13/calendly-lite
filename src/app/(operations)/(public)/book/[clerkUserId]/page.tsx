import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { formatDuration } from "@/lib/formatters"
import { clerkClient } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch";

export const revalidate = 0

export default async function BookingPage({
  params
}: {
  params: Promise<{clerkUserId: string}>
}) {
  const { clerkUserId} = await params
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  if (events.length === 0) return notFound()

  const { fullName } = await (await clerkClient()).users.getUser(clerkUserId)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xl md:text-3xl font-semibold mb-8 text-center">
        {fullName}
      </div>
      <div className="text-muted-foreground mb-8 max-w-sm mx-auto text-center">
        Welcome to my scheduling page. Please follow the instructions to add an
        event to my calendar.
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {events.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}

type EventCardProps = {
  id: string
  name: string
  clerkUserId: string
  description: string | null
  duration: number
}

function EventCard({
  id,
  name,
  description,
  clerkUserId,
  duration,
}: EventCardProps) {
  return (
<Card className="flex flex-col shadow-sm hover:shadow-md">
      <CardHeader>
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
        <CardContent className={cn("text-md")}>
          {description}
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild className="rounded-md">
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
