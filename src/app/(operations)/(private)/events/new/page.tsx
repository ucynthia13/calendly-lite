import EventForm from "@/components/forms/eventform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEvent() {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>New Event</CardTitle>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    )
}